import type {
  PlayerRankResult,
  SaveScoreRequest,
  SaveScoreResult,
  ScoreRecord,
} from '../types/scores';
import { apiClient } from './http';

export async function saveScore(
  payload: SaveScoreRequest,
): Promise<SaveScoreResult> {
  const response = await apiClient.post<SaveScoreResult>('/scores', payload);
  return response.data;
}

export async function getTopScores(limit = 10): Promise<ScoreRecord[]> {
  const response = await apiClient.get<ScoreRecord[]>('/scores/top', {
    params: { limit },
  });
  return response.data;
}

export async function getPlayerRank(
  playerName: string,
): Promise<PlayerRankResult> {
  const response = await apiClient.get<PlayerRankResult>('/scores/me', {
    params: { playerName },
  });
  return response.data;
}
