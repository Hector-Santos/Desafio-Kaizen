export type PiecePosition = {
  x: number;
  y: number;
};

export function createRandomPositions(count: number): PiecePosition[] {
  return Array.from({ length: Math.min(count, 8) }, createRandomPosition);
}

export function createRandomPosition(): PiecePosition {
  return {
    x: 8 + Math.random() * 84,
    y: 18 + Math.random() * 72,
  };
}
