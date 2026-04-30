import { maxRenderedPieceEvents } from './constants';
import type { GameState, PieceEvent } from './gameTypes';
import { appendHistoryPoint } from './history';
import { getFactoryMetrics } from './metrics';
import type { PiecePosition } from './positions';

export function producePieces(
  state: GameState,
  count: number,
  positions: PiecePosition[],
): GameState {
  if (count <= 0) return state;

  const metrics = getFactoryMetrics(state.improvements);
  let nextState = state;

  for (let index = 0; index < count; index += 1) {
    const isDefect = Math.random() < metrics.defectRate;
    const position = positions[index] ?? positions[positions.length - 1];
    nextState = appendProducedPiece(nextState, isDefect, position);
    nextState = appendHistoryPointToState(nextState);
  }

  return nextState;
}

function appendProducedPiece(
  state: GameState,
  isDefect: boolean,
  position: PiecePosition | undefined,
): GameState {
  const pieceEvent: PieceEvent = {
    id: state.nextPieceId,
    status: isDefect ? 'bad' : 'good',
    x: position?.x ?? 50,
    y: position?.y ?? 50,
  };

  return {
    ...state,
    points: isDefect ? state.points : state.points + 1,
    totalProduced: state.totalProduced + 1,
    goodPieces: isDefect ? state.goodPieces : state.goodPieces + 1,
    defects: isDefect ? state.defects + 1 : state.defects,
    nextPieceId: state.nextPieceId + 1,
    pieceEvents: [...state.pieceEvents, pieceEvent].slice(
      -maxRenderedPieceEvents,
    ),
  };
}

function appendHistoryPointToState(state: GameState): GameState {
  return {
    ...state,
    history: appendHistoryPoint(state),
  };
}
