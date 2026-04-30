import type {
  PlayerRankResult,
  SaveScoreRequest,
  SaveScoreResult,
  ScoreRecord,
} from '../types/scores';

const now = new Date().toISOString();

export const mockTopScores: ScoreRecord[] = [
  {
    id: 'ana',
    playerName: 'Ana',
    score: 18420,
    improvements: createEmptyImprovements(),
    elapsedSeconds: 1800,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'bruno',
    playerName: 'Bruno',
    score: 13210,
    improvements: createEmptyImprovements(),
    elapsedSeconds: 1420,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'carla',
    playerName: 'Carla',
    score: 9870,
    improvements: createEmptyImprovements(),
    elapsedSeconds: 980,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'diego',
    playerName: 'Diego',
    score: 7620,
    improvements: createEmptyImprovements(),
    elapsedSeconds: 860,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'elisa',
    playerName: 'Elisa',
    score: 6110,
    improvements: createEmptyImprovements(),
    elapsedSeconds: 720,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'felipe',
    playerName: 'Felipe',
    score: 4920,
    improvements: createEmptyImprovements(),
    elapsedSeconds: 620,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'giulia',
    playerName: 'Giulia',
    score: 3480,
    improvements: createEmptyImprovements(),
    elapsedSeconds: 470,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'hector',
    playerName: 'Hector',
    score: 2210,
    improvements: createEmptyImprovements(),
    elapsedSeconds: 360,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'iris',
    playerName: 'Iris',
    score: 1440,
    improvements: createEmptyImprovements(),
    elapsedSeconds: 240,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'joao',
    playerName: 'Joao',
    score: 810,
    improvements: createEmptyImprovements(),
    elapsedSeconds: 120,
    createdAt: now,
    updatedAt: now,
  },
];

export function createMockSaveResult(
  request: SaveScoreRequest,
): SaveScoreResult {
  return {
    saved: true,
    score: {
      id: request.playerName.trim().toLowerCase(),
      playerName: request.playerName.trim(),
      score: request.score,
      improvements: request.improvements,
      elapsedSeconds: request.elapsedSeconds,
      createdAt: now,
      updatedAt: now,
    },
  };
}

export function createMockRank(playerName: string): PlayerRankResult {
  const normalizedName = playerName.trim().toLowerCase();
  const score =
    mockTopScores.find((record) => record.id === normalizedName) ?? null;

  return {
    rank: score
      ? mockTopScores.findIndex((record) => record.id === normalizedName) + 1
      : null,
    score,
  };
}

function createEmptyImprovements() {
  return {
    '5S': 0,
    Kanban: 0,
    'Poka-Yoke': 0,
    TPM: 0,
    Andon: 0,
    Heijunka: 0,
  };
}
