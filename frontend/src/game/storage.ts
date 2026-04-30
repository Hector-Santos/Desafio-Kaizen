import { advanceGameBySeconds, createInitialGameState } from './gameEngine';
import type { GameState } from './gameTypes';

const storageKey = 'kaizen-clicker-game';

export function loadGameState(): GameState {
  const fallback = createInitialGameState();
  const storedValue = window.localStorage.getItem(storageKey);

  if (!storedValue) return fallback;

  try {
    const parsed = JSON.parse(storedValue) as GameState;
    const offlineSeconds = Math.max(
      0,
      Math.floor((Date.now() - parsed.lastSavedAt) / 1000),
    );
    return {
      ...advanceGameBySeconds(parsed, Math.min(offlineSeconds, 60 * 60 * 8)),
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
