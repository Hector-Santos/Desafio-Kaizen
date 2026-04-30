import type {
  PlayerRankResult,
  SaveScoreRequest,
  SaveScoreResult,
  ScoreRecord,
} from '../types/scores';
import { apiClient } from './http';
import {
  createMockRank,
  createMockSaveResult,
  mockTopScores,
} from './mockScores';

export async function saveScore(
  payload: SaveScoreRequest,
): Promise<SaveScoreResult> {
  try {
    const response = await apiClient.post<SaveScoreResult>('/scores', payload);
    return response.data;
  } catch {
    return createMockSaveResult(payload);
  }
}

export async function getTopScores(limit = 10): Promise<ScoreRecord[]> {
  try {
    const response = await apiClient.get<ScoreRecord[]>('/scores/top', {
      params: { limit },
    });
    return response.data;
  } catch {
    return mockTopScores.slice(0, limit);
  }
}

export async function getPlayerRank(
  playerName: string,
): Promise<PlayerRankResult> {
  try {
    const response = await apiClient.get<PlayerRankResult>('/scores/me', {
      params: { playerName },
    });
    return response.data;
  } catch {
    return createMockRank(playerName);
  }
}
