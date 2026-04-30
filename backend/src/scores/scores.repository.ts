import { Injectable } from '@nestjs/common';
import {
  CollectionReference,
  DocumentData,
  FieldValue,
  Timestamp,
} from 'firebase-admin/firestore';
import { DatabaseService } from '../database/database.service';
import { Improvements, ScoreRecord } from './scores.types';

export type StoredScore = Omit<
  ScoreRecord,
  'id' | 'createdAt' | 'updatedAt'
> & {
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type ScoreWritePayload = {
  playerName: string;
  score: number;
  improvements: Improvements;
  elapsedSeconds: number;
};

@Injectable()
export class ScoresRepository {
  private readonly memoryScores = new Map<string, ScoreRecord>();
  private readonly useMemoryStorage = shouldUseMemoryStorage();

  constructor(private readonly database: DatabaseService) {}

  async saveIfHigher(
    id: string,
    payload: ScoreWritePayload,
  ): Promise<{ saved: boolean; score: ScoreRecord }> {
    if (this.useMemoryStorage) {
      return this.saveInMemoryIfHigher(id, payload);
    }

    const scoreRef = this.scoresCollection.doc(id);

    return this.database.runTransaction(async (transaction) => {
      const existingSnapshot = await transaction.get(scoreRef);
      const existingScore = existingSnapshot.exists
        ? this.mapStoredScore(id, existingSnapshot.data() as StoredScore)
        : null;

      if (existingScore && existingScore.score >= payload.score) {
        return {
          saved: false,
          score: existingScore,
        };
      }

      transaction.set(
        scoreRef,
        {
          ...payload,
          updatedAt: FieldValue.serverTimestamp(),
          ...(existingScore ? {} : { createdAt: FieldValue.serverTimestamp() }),
        },
        { merge: true },
      );

      const now = Timestamp.now().toDate().toISOString();

      return {
        saved: true,
        score: {
          id,
          ...payload,
          createdAt: existingScore?.createdAt ?? now,
          updatedAt: now,
        },
      };
    });
  }

  async findTop(limit: number): Promise<ScoreRecord[]> {
    if (this.useMemoryStorage) {
      return [...this.memoryScores.values()]
        .sort((first, second) => second.score - first.score)
        .slice(0, limit);
    }

    const snapshot = await this.scoresCollection
      .orderBy('score', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) => this.mapStoredScore(doc.id, doc.data()));
  }

  async findById(id: string): Promise<ScoreRecord | null> {
    if (this.useMemoryStorage) {
      return this.memoryScores.get(id) ?? null;
    }

    const snapshot = await this.scoresCollection.doc(id).get();

    if (!snapshot.exists) {
      return null;
    }

    return this.mapStoredScore(id, snapshot.data() as StoredScore);
  }

  async countScoresAbove(score: number): Promise<number> {
    if (this.useMemoryStorage) {
      return [...this.memoryScores.values()].filter(
        (record) => record.score > score,
      ).length;
    }

    const snapshot = await this.scoresCollection
      .where('score', '>', score)
      .count()
      .get();

    return snapshot.data().count;
  }

  private get scoresCollection(): CollectionReference<
    StoredScore,
    DocumentData
  > {
    return this.database.collection<StoredScore>('scores');
  }

  private saveInMemoryIfHigher(
    id: string,
    payload: ScoreWritePayload,
  ): { saved: boolean; score: ScoreRecord } {
    const existingScore = this.memoryScores.get(id);

    if (existingScore && existingScore.score >= payload.score) {
      return {
        saved: false,
        score: existingScore,
      };
    }

    const now = new Date().toISOString();
    const score: ScoreRecord = {
      id,
      ...payload,
      createdAt: existingScore?.createdAt ?? now,
      updatedAt: now,
    };

    this.memoryScores.set(id, score);

    return {
      saved: true,
      score,
    };
  }

  private mapStoredScore(id: string, data: StoredScore): ScoreRecord {
    return {
      id,
      playerName: data.playerName,
      score: data.score,
      improvements: data.improvements,
      elapsedSeconds: data.elapsedSeconds,
      createdAt: data.createdAt.toDate().toISOString(),
      updatedAt: data.updatedAt.toDate().toISOString(),
    };
  }
}

function shouldUseMemoryStorage(): boolean {
  if (process.env.SCORES_STORAGE === 'memory') {
    return true;
  }

  return (
    process.env.USE_FIREBASE_EMULATOR !== 'true' &&
    !process.env.FIREBASE_PROJECT_ID &&
    !process.env.GCLOUD_PROJECT &&
    !process.env.GOOGLE_CLOUD_PROJECT
  );
}
