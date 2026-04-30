import { useRef } from 'react';

import './App.css';
import * as Styled from './App.styled';
import { AppHeader } from './components/AppHeader/AppHeader';
import { FactoryStage } from './components/FactoryStage/FactoryStage';
import { ImprovementsPanel } from './components/ImprovementsPanel/ImprovementsPanel';
import { ProductionDashboard } from './components/ProductionDashboard/ProductionDashboard';
import { RankingPanel } from './components/RankingPanel/RankingPanel';
import { SaveScorePanel } from './components/SaveScorePanel/SaveScorePanel';
import { Panel, SectionTitle } from './components/shared/shared.styled';
import { StatsGrid } from './components/StatsGrid/StatsGrid';
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
    <Styled.AppShell>
      <AppHeader
        onRankingClick={scrollToRanking}
        onSaveClick={scrollToSaveScore}
      />

      <Styled.Layout>
        <Panel>
          <SectionTitle>Factory Floor</SectionTitle>

          <FactoryStage
            metrics={metrics}
            pieces={state.pieceEvents}
            onProduce={produceAt}
            onPieceDone={removePieceEvent}
          />
          <StatsGrid game={state} metrics={metrics} />
          <ProductionDashboard history={state.history} />
        </Panel>

        <ImprovementsPanel
          game={state}
          canPurchase={canPurchaseUpgrade}
          onPurchase={purchaseUpgrade}
        />
      </Styled.Layout>

      <Styled.SecondaryLayout>
        <div ref={rankingRef}>
          <RankingPanel />
        </div>

        <div ref={saveScoreRef}>
          <SaveScorePanel game={state} />
        </div>
      </Styled.SecondaryLayout>
    </Styled.AppShell>
  );
}
