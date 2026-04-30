import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { db } from '../firebase.admin';
import { CreateScoreDto } from './dto/create-score.dto';
import {
  IMPROVEMENT_NAMES,
  Improvements,
  PlayerRankResult,
  SaveScoreResult,
  ScoreRecord,
} from './scores.types';

type StoredScore = Omit<ScoreRecord, 'id' | 'createdAt' | 'updatedAt'> & {
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

const MAX_IMPROVEMENT_PURCHASES = 5;
const SCORE_GRACE_POINTS = 1000;
const MAX_PLAUSIBLE_POINTS_PER_SECOND = 100;

@Injectable()
export class ScoresService {
  private readonly scoresCollection = db.collection('scores');

  async saveScore(createScoreDto: CreateScoreDto): Promise<SaveScoreResult> {
    const normalizedPlayerName = this.normalizePlayerName(
      createScoreDto.playerName,
    );
    const improvements = this.normalizeImprovements(
      createScoreDto.improvements,
    );

    this.assertScoreIsPlausible(
      createScoreDto.score,
      createScoreDto.elapsedSeconds,
    );

    const scoreRef = this.scoresCollection.doc(normalizedPlayerName);

    return db.runTransaction(async (transaction) => {
      const existingSnapshot = await transaction.get(scoreRef);
      const existingScore = existingSnapshot.exists
        ? this.mapSnapshot(
            existingSnapshot.id,
            existingSnapshot.data() as StoredScore,
          )
        : null;

      if (existingScore && existingScore.score >= createScoreDto.score) {
        return {
          saved: false,
          score: existingScore,
        };
      }

      const scorePayload = {
        playerName: createScoreDto.playerName.trim(),
        score: createScoreDto.score,
        improvements,
        elapsedSeconds: createScoreDto.elapsedSeconds,
        updatedAt: FieldValue.serverTimestamp(),
        ...(existingScore ? {} : { createdAt: FieldValue.serverTimestamp() }),
      };

      transaction.set(scoreRef, scorePayload, { merge: true });

      const now = Timestamp.now();

      return {
        saved: true,
        score: {
          id: normalizedPlayerName,
          playerName: scorePayload.playerName,
          score: scorePayload.score,
          improvements: scorePayload.improvements,
          elapsedSeconds: scorePayload.elapsedSeconds,
          createdAt: existingScore?.createdAt ?? now.toDate().toISOString(),
          updatedAt: now.toDate().toISOString(),
        },
      };
    });
  }

  async getTopScores(limit = 10): Promise<ScoreRecord[]> {
    const snapshot = await this.scoresCollection
      .orderBy('score', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) =>
      this.mapSnapshot(doc.id, doc.data() as StoredScore),
    );
  }

  async getPlayerRank(playerName: string): Promise<PlayerRankResult> {
    const normalizedPlayerName = this.normalizePlayerName(playerName);
    const playerSnapshot = await this.scoresCollection
      .doc(normalizedPlayerName)
      .get();

    if (!playerSnapshot.exists) {
      return {
        rank: null,
        score: null,
      };
    }

    const playerScore = this.mapSnapshot(
      playerSnapshot.id,
      playerSnapshot.data() as StoredScore,
    );
    const betterScoresSnapshot = await this.scoresCollection
      .where('score', '>', playerScore.score)
      .count()
      .get();

    return {
      rank: betterScoresSnapshot.data().count + 1,
      score: playerScore,
    };
  }

  private normalizePlayerName(playerName: string): string {
    return playerName.trim().toLowerCase();
  }

  private normalizeImprovements(
    improvements: Record<string, number>,
  ): Improvements {
    const normalizedEntries = IMPROVEMENT_NAMES.map((name) => {
      const value = improvements[name] ?? 0;

      if (
        !Number.isInteger(value) ||
        value < 0 ||
        value > MAX_IMPROVEMENT_PURCHASES
      ) {
        throw new BadRequestException(
          `${name} must be an integer between 0 and ${MAX_IMPROVEMENT_PURCHASES}`,
        );
      }

      return [name, value] as const;
    });

    return Object.fromEntries(normalizedEntries) as Improvements;
  }

  private assertScoreIsPlausible(score: number, elapsedSeconds: number): void {
    const maxPlausibleScore =
      elapsedSeconds * MAX_PLAUSIBLE_POINTS_PER_SECOND + SCORE_GRACE_POINTS;

    if (score > maxPlausibleScore) {
      throw new UnprocessableEntityException(
        `Score is not plausible for ${elapsedSeconds} elapsed seconds`,
      );
    }
  }

  private mapSnapshot(id: string, data: StoredScore): ScoreRecord {
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
