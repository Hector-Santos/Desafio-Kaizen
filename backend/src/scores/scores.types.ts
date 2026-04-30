export const IMPROVEMENT_NAMES = [
  '5S',
  'Kanban',
  'Poka-Yoke',
  'TPM',
  'Andon',
  'Heijunka',
] as const;

export type ImprovementName = (typeof IMPROVEMENT_NAMES)[number];

export type Improvements = Record<ImprovementName, number>;

export interface ScoreRecord {
  id: string;
  playerName: string;
  score: number;
  improvements: Improvements;
  elapsedSeconds: number;
  createdAt: string;
  updatedAt: string;
}

export interface SaveScoreResult {
  saved: boolean;
  score: ScoreRecord;
}

export interface PlayerRankResult {
  rank: number | null;
  score: ScoreRecord | null;
}
