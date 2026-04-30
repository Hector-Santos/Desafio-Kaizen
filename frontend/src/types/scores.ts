import type { ImprovementLevels } from '../game/gameTypes';

export type ScoreRecord = {
  id: string;
  playerName: string;
  score: number;
  improvements: ImprovementLevels;
  elapsedSeconds: number;
  createdAt: string;
  updatedAt: string;
};

export type SaveScoreRequest = {
  playerName: string;
  score: number;
  improvements: ImprovementLevels;
  elapsedSeconds: number;
};

export type SaveScoreResult = {
  saved: boolean;
  score: ScoreRecord;
};

export type PlayerRankResult = {
  rank: number | null;
  score: ScoreRecord | null;
};
