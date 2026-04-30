import { advanceGameBySeconds, createInitialGameState } from './gameEngine';
import type { ChartPoint, GameState } from './gameTypes';

const storageKey = 'kaizen-clicker-game';

export function loadGameState(): GameState {
  const fallback = createInitialGameState();
  const storedValue = window.localStorage.getItem(storageKey);

  if (!storedValue) return fallback;

  try {
    const parsed = JSON.parse(storedValue) as GameState;
    const hydratedState = hydrateStoredState(parsed);
    const offlineSeconds = Math.max(
      0,
      Math.floor((Date.now() - hydratedState.lastSavedAt) / 1000),
    );
    return {
      ...advanceGameBySeconds(
        hydratedState,
        Math.min(offlineSeconds, 60 * 60 * 8),
      ),
      lastSavedAt: Date.now(),
      pieceEvents: [],
    };
  } catch {
    return fallback;
  }
}

export function saveGameState(state: GameState): void {
  const snapshot: GameState = {
    ...state,
    lastSavedAt: Date.now(),
    pieceEvents: [],
  };

  window.localStorage.setItem(storageKey, JSON.stringify(snapshot));
}

function hydrateStoredState(state: GameState): GameState {
  return {
    ...state,
    history: state.history.map((point, index) =>
      hydrateChartPoint(point, index),
    ),
  };
}

function hydrateChartPoint(point: ChartPoint, index: number): ChartPoint {
  return {
    ...point,
    second: typeof point.second === 'number' ? point.second : index,
  };
}
