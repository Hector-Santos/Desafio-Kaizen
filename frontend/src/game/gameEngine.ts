import type {
  FactoryMetrics,
  GameState,
  ImprovementLevels,
  PieceEvent,
} from './gameTypes';
import {
  initialImprovements,
  maxUpgradeLevel,
  upgrades,
  getUpgradeCost,
} from './upgrades';

const initialDefectRate = 0.3;
const initialOee = 0.4;
const initialSpeed = 1;
const maxHistoryPoints = 30;

export function createInitialGameState(now = Date.now()): GameState {
  const history = createInitialHistory();

  return {
    points: 0,
    elapsedSeconds: 0,
    totalProduced: 0,
    goodPieces: 0,
    defects: 0,
    productionCarry: 0,
    improvements: { ...initialImprovements },
    recentDefectTicks: [],
    history,
    lastSavedAt: now,
    nextPieceId: 1,
    pieceEvents: [],
  };
}

export function getFactoryMetrics(
  improvements: ImprovementLevels,
): FactoryMetrics {
  const speed =
    initialSpeed *
    1.1 ** improvements['5S'] *
    1.2 ** improvements.Kanban *
    (improvements.Heijunka > 0 ? 1 + improvements.Heijunka * 0.04 : 1);

  const defectRate =
    initialDefectRate *
    0.95 ** improvements['5S'] *
    0.85 ** improvements['Poka-Yoke'] *
    0.9 ** improvements.TPM;

  const oee =
    initialOee + improvements.TPM * 0.15 + improvements.Heijunka * 0.25;

  return {
    speed,
    defectRate: clamp(defectRate, 0.01, 0.95),
    oee: clamp(oee, 0, 1),
  };
}

export function canBuyUpgrade(state: GameState, upgradeName: string): boolean {
  const upgrade = upgrades.find((item) => item.name === upgradeName);
  if (!upgrade) return false;

  const level = state.improvements[upgrade.name];
  return (
    level < maxUpgradeLevel &&
    state.points >= getUpgradeCost(upgrade.baseCost, level)
  );
}

export function buyUpgrade(state: GameState, upgradeName: string): GameState {
  const upgrade = upgrades.find((item) => item.name === upgradeName);
  if (!upgrade) return state;

  const level = state.improvements[upgrade.name];
  const cost = getUpgradeCost(upgrade.baseCost, level);

  if (level >= maxUpgradeLevel || state.points < cost) return state;

  return {
    ...state,
    points: state.points - cost,
    improvements: {
      ...state.improvements,
      [upgrade.name]: level + 1,
    },
  };
}

export function advanceGameBySeconds(
  state: GameState,
  seconds: number,
): GameState {
  if (seconds <= 0) return state;

  let nextState: GameState = { ...state, pieceEvents: [] };

  for (let index = 0; index < seconds; index += 1) {
    nextState = advanceOneSecond(nextState);
  }

  return nextState;
}

export function produceManualPiece(
  state: GameState,
  x: number,
  y: number,
): GameState {
  return producePieces(state, 1, [{ x, y }]);
}

export function clearPieceEvent(state: GameState, id: number): GameState {
  return {
    ...state,
    pieceEvents: state.pieceEvents.filter((piece) => piece.id !== id),
  };
}

function advanceOneSecond(state: GameState): GameState {
  const metrics = getFactoryMetrics(state.improvements);
  const productionWithCarry = metrics.speed + state.productionCarry;
  const pieceCount = Math.floor(productionWithCarry);
  const productionCarry = productionWithCarry - pieceCount;
  const producedState = producePieces(
    state,
    pieceCount,
    createRandomPositions(pieceCount),
  );
  const defectDelta = producedState.defects - state.defects;
  const recentDefectTicks = [
    ...producedState.recentDefectTicks,
    defectDelta,
  ].slice(-60);
  const defectsPerMinute = recentDefectTicks.reduce(
    (total, value) => total + value,
    0,
  );

  return {
    ...producedState,
    elapsedSeconds: producedState.elapsedSeconds + 1,
    productionCarry,
    recentDefectTicks,
    history: [
      ...producedState.history,
      {
        label: `${producedState.elapsedSeconds + 1}s`,
        production: producedState.goodPieces,
        defectsPerMinute,
        oee: Math.round(metrics.oee * 100),
      },
    ].slice(-maxHistoryPoints),
  };
}

function producePieces(
  state: GameState,
  count: number,
  positions: Array<{ x: number; y: number }>,
): GameState {
  if (count <= 0) return state;

  const metrics = getFactoryMetrics(state.improvements);
  let goodPieces = state.goodPieces;
  let defects = state.defects;
  let points = state.points;
  let nextPieceId = state.nextPieceId;
  const pieceEvents: PieceEvent[] = [...state.pieceEvents];

  for (let index = 0; index < count; index += 1) {
    const isDefect = Math.random() < metrics.defectRate;

    if (isDefect) {
      defects += 1;
    } else {
      goodPieces += 1;
      points += 1;
    }

    const position = positions[index] ?? createRandomPosition();
    pieceEvents.push({
      id: nextPieceId,
      status: isDefect ? 'bad' : 'good',
      x: position.x,
      y: position.y,
    });
    nextPieceId += 1;
  }

  return {
    ...state,
    points,
    totalProduced: state.totalProduced + count,
    goodPieces,
    defects,
    nextPieceId,
    pieceEvents: pieceEvents.slice(-40),
  };
}

function createInitialHistory(): GameState['history'] {
  return Array.from({ length: 16 }, (_, index) => ({
    label: `${index}s`,
    production: 0,
    defectsPerMinute: 0,
    oee: Math.round(initialOee * 100),
  }));
}

function createRandomPositions(count: number): Array<{ x: number; y: number }> {
  return Array.from({ length: Math.min(count, 8) }, createRandomPosition);
}

function createRandomPosition(): { x: number; y: number } {
  return {
    x: 8 + Math.random() * 84,
    y: 18 + Math.random() * 72,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
