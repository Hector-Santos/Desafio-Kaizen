import { maxOfflineSeconds } from './constants';
import type { GameState } from './gameTypes';
import { appendHistoryPoint, createInitialHistory } from './history';
import { getFactoryMetrics } from './metrics';
import { createRandomPositions } from './positions';
import { producePieces } from './production';
import { initialImprovements } from './upgrades';
export { buyUpgrade, canBuyUpgrade } from './upgradesLogic';
export { getFactoryMetrics } from './metrics';

export function createInitialGameState(now = Date.now()): GameState {
  return {
    points: 0,
    elapsedSeconds: 0,
    totalProduced: 0,
    goodPieces: 0,
    defects: 0,
    productionCarry: 0,
    improvements: { ...initialImprovements },
    recentDefectTicks: [],
    history: createInitialHistory(),
    lastSavedAt: now,
    nextPieceId: 1,
    pieceEvents: [],
  };
}

export function advanceGameBySeconds(
  state: GameState,
  seconds: number,
): GameState {
  if (seconds <= 0) return state;

  const boundedSeconds = Math.min(seconds, maxOfflineSeconds);
  let nextState: GameState = { ...state, pieceEvents: [] };

  for (let index = 0; index < boundedSeconds; index += 1) {
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
  const { speed } = getProductionMetrics(state);
  const productionWithCarry = speed + state.productionCarry;
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
  const updatedState = {
    ...producedState,
    elapsedSeconds: producedState.elapsedSeconds + 1,
    productionCarry,
    recentDefectTicks,
  };

  return {
    ...updatedState,
    history: appendHistoryPoint(updatedState, recentDefectTicks),
  };
}

function getProductionMetrics(state: GameState): { speed: number } {
  return { speed: getFactoryMetrics(state.improvements).speed };
}
