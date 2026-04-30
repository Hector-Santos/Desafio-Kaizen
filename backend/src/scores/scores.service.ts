import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateScoreDto } from './dto/create-score.dto';
import { MAX_IMPROVEMENT_PURCHASES } from './dto/improvements.dto';
import { ScoresRepository } from './scores.repository';
import {
  IMPROVEMENT_NAMES,
  Improvements,
  ImprovementName,
  PlayerRankResult,
  SaveScoreResult,
  ScoreRecord,
} from './scores.types';

const SCORE_GRACE_POINTS = 1000;
const MAX_PLAUSIBLE_POINTS_PER_SECOND = 100;

@Injectable()
export class ScoresService {
  constructor(private readonly scoresRepository: ScoresRepository) {}

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

    return this.scoresRepository.saveIfHigher(normalizedPlayerName, {
      playerName: createScoreDto.playerName.trim(),
      score: createScoreDto.score,
      improvements,
      elapsedSeconds: createScoreDto.elapsedSeconds,
    });
  }

  async getTopScores(limit = 10): Promise<ScoreRecord[]> {
    return this.scoresRepository.findTop(limit);
  }

  async getPlayerRank(playerName: string): Promise<PlayerRankResult> {
    const normalizedPlayerName = this.normalizePlayerName(playerName);
    const playerScore =
      await this.scoresRepository.findById(normalizedPlayerName);

    if (!playerScore) {
      return {
        rank: null,
        score: null,
      };
    }

    const betterScoreCount = await this.scoresRepository.countScoresAbove(
      playerScore.score,
    );

    return {
      rank: betterScoreCount + 1,
      score: playerScore,
    };
  }

  private normalizePlayerName(playerName: string): string {
    return playerName.trim().toLowerCase();
  }

  private normalizeImprovements(
    improvements: Partial<Record<ImprovementName, number>>,
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
}
