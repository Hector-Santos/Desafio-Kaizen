import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  advanceGameBySeconds,
  buyUpgrade,
  canBuyUpgrade,
  clearPieceEvent,
  getFactoryMetrics,
  produceManualPiece,
} from '../game/gameEngine';
import type { GameState, ImprovementName } from '../game/gameTypes';
import { loadGameState, saveGameState } from '../game/storage';

export function useGameState() {
  const [state, setState] = useState<GameState>(() => loadGameState());
  const lastClockRef = useRef(Date.now());
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - lastClockRef.current) / 1000);

      if (elapsedSeconds <= 0) return;

      lastClockRef.current += elapsedSeconds * 1000;
      setState((currentState) =>
        advanceGameBySeconds(currentState, elapsedSeconds),
      );
    }, 250);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => saveGameState(state), 300);
    return () => window.clearTimeout(timeoutId);
  }, [state]);

  useEffect(() => {
    function saveCurrentState() {
      saveGameState(stateRef.current);
    }

    function handleVisibilityChange() {
      if (document.visibilityState === 'hidden') {
        saveCurrentState();
      }
    }

    window.addEventListener('pagehide', saveCurrentState);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('pagehide', saveCurrentState);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const metrics = useMemo(
    () => getFactoryMetrics(state.improvements),
    [state.improvements],
  );

  const purchaseUpgrade = useCallback((upgradeName: ImprovementName) => {
    setState((currentState) => buyUpgrade(currentState, upgradeName));
  }, []);

  const produceAt = useCallback((x: number, y: number) => {
    setState((currentState) => produceManualPiece(currentState, x, y));
  }, []);

  const removePieceEvent = useCallback((id: number) => {
    setState((currentState) => clearPieceEvent(currentState, id));
  }, []);

  const canPurchaseUpgrade = useCallback(
    (upgradeName: ImprovementName) => canBuyUpgrade(state, upgradeName),
    [state],
  );

  return {
    state,
    metrics,
    purchaseUpgrade,
    produceAt,
    removePieceEvent,
    canPurchaseUpgrade,
  };
}
