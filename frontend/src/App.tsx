import { useRef } from 'react';

import './App.css';
import { AppHeader } from './components/AppHeader';
import { FactoryStage } from './components/FactoryStage';
import { ImprovementsPanel } from './components/ImprovementsPanel';
import { ProductionDashboard } from './components/ProductionDashboard';
import { RankingPanel } from './components/RankingPanel';
import { SaveScorePanel } from './components/SaveScorePanel';
import { StatsGrid } from './components/StatsGrid';
import { useGameState } from './hooks/useGameState';

export default function App() {
  const rankingRef = useRef<HTMLDivElement | null>(null);
  const saveScoreRef = useRef<HTMLDivElement | null>(null);
  const {
    state,
    metrics,
    purchaseUpgrade,
    produceAt,
    removePieceEvent,
    canPurchaseUpgrade,
  } = useGameState();

  function scrollToRanking() {
    rankingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function scrollToSaveScore() {
    saveScoreRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  return (
    <main className="app">
      <AppHeader
        onRankingClick={scrollToRanking}
        onSaveClick={scrollToSaveScore}
      />

      <section className="layout">
        <div className="panel">
          <h2 className="section-title">Factory Floor</h2>

          <FactoryStage
            metrics={metrics}
            pieces={state.pieceEvents}
            onProduce={produceAt}
            onPieceDone={removePieceEvent}
          />
          <StatsGrid game={state} metrics={metrics} />
          <ProductionDashboard history={state.history} />
        </div>

        <ImprovementsPanel
          game={state}
          canPurchase={canPurchaseUpgrade}
          onPurchase={purchaseUpgrade}
        />
      </section>

      <section className="secondary-layout">
        <div ref={rankingRef}>
          <RankingPanel />
        </div>

        <div ref={saveScoreRef}>
          <SaveScorePanel game={state} />
        </div>
      </section>
    </main>
  );
}
