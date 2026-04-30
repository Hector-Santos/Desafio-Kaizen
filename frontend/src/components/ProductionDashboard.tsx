import type { ReactNode } from 'react';

import type { ChartPoint } from '../game/gameTypes';
import { LineChart } from './LineChart';

type ProductionDashboardProps = {
  history: ChartPoint[];
};

export function ProductionDashboard({ history }: ProductionDashboardProps) {
  const labels = history.map((point) => point.label);

  return (
    <div className="dashboard">
      <ChartCard title="Accumulated Production">
        <LineChart
          title="Good pieces produced"
          labels={labels}
          values={history.map((point) => point.production)}
          color="#22c55e"
          fill="rgba(34, 197, 94, 0.16)"
        />
      </ChartCard>

      <ChartCard title="Defects per Minute">
        <LineChart
          title="Defects per minute"
          labels={labels}
          values={history.map((point) => point.defectsPerMinute)}
          color="#ef4444"
          fill="rgba(239, 68, 68, 0.15)"
        />
      </ChartCard>

      <ChartCard title="OEE">
        <LineChart
          title="OEE percentage"
          labels={labels}
          values={history.map((point) => point.oee)}
          color="#38bdf8"
          fill="rgba(56, 189, 248, 0.16)"
        />
      </ChartCard>
    </div>
  );
}

type ChartCardProps = {
  title: string;
  children: ReactNode;
};

function ChartCard({ title, children }: ChartCardProps) {
  return (
    <article className="chart-card">
      <strong>{title}</strong>
      <div className="chart-placeholder chart-filled">{children}</div>
    </article>
  );
}
