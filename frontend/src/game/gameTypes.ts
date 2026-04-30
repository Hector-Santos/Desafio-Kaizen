export const improvementNames = [
  '5S',
  'Kanban',
  'Poka-Yoke',
  'TPM',
  'Andon',
  'Heijunka',
] as const;

export type ImprovementName = (typeof improvementNames)[number];

export type ImprovementLevels = Record<ImprovementName, number>;

export type UpgradeDefinition = {
  name: ImprovementName;
  label: string;
  effect: string;
  baseCost: number;
};

export type FactoryMetrics = {
  speed: number;
  defectRate: number;
  oee: number;
};

export type ChartPoint = {
  label: string;
  second: number;
  production: number;
  defectsPerMinute: number;
  oee: number;
};

export type PieceEvent = {
  id: number;
  status: 'good' | 'bad';
  x: number;
  y: number;
};

export type GameState = {
  points: number;
  elapsedSeconds: number;
  totalProduced: number;
  goodPieces: number;
  defects: number;
  productionCarry: number;
  improvements: ImprovementLevels;
  recentDefectTicks: number[];
  history: ChartPoint[];
  lastSavedAt: number;
  nextPieceId: number;
  pieceEvents: PieceEvent[];
};
