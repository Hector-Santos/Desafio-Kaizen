import type { FactoryMetrics, GameState } from '../game/gameTypes';
import { StatCard } from './StatCard';

type StatsGridProps = {
  game: GameState;
  metrics: FactoryMetrics;
};

export function StatsGrid({ game, metrics }: StatsGridProps) {
  return (
    <div className="stats-grid">
      <StatCard
        label="Kaizen Points"
        value={Math.floor(game.points).toLocaleString('en-US')}
      />
      <StatCard
        label="Production Speed"
        value={`${metrics.speed.toFixed(2)}/s`}
      />
      <StatCard
        label="Defect Rate"
        value={`${Math.round(metrics.defectRate * 100)}%`}
      />
      <StatCard label="OEE" value={`${Math.round(metrics.oee * 100)}%`} />
    </div>
  );
}
