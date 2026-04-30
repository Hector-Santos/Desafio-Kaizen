import type { ReactNode } from 'react';

import type { ChartPoint } from '../../game/gameTypes';
import {
  createRelativeLabels,
  getVisibleChartPoints,
} from '../../game/history';
import { LineChart } from '../LineChart/LineChart';
import { OeeGauge } from '../OeeGauge/OeeGauge';
import * as Styled from './ProductionDashboard.styled';

type ProductionDashboardProps = {
  history: ChartPoint[];
};

export function ProductionDashboard({ history }: ProductionDashboardProps) {
  const visiblePoints = getVisibleChartPoints(history);
  const labels = createRelativeLabels(visiblePoints);
  const currentOee = history[history.length - 1]?.oee ?? 0;

  return (
    <Styled.Dashboard>
      <ChartCard title="Accumulated Production">
        <LineChart
          title="Good pieces produced"
          xAxisTitle="Last minute"
          yAxisTitle="Good pieces"
          labels={labels}
          values={visiblePoints.map((point) => point.production)}
          color="#22c55e"
          fill="rgba(34, 197, 94, 0.16)"
        />
      </ChartCard>

      <ChartCard title="Defects per Minute">
        <LineChart
          title="Defects per minute"
          xAxisTitle="Last minute"
          yAxisTitle="Defects"
          labels={labels}
          values={visiblePoints.map((point) => point.defectsPerMinute)}
          color="#ef4444"
          fill="rgba(239, 68, 68, 0.15)"
        />
      </ChartCard>

      <ChartCard title="OEE">
        <OeeGauge value={currentOee} />
      </ChartCard>
    </Styled.Dashboard>
  );
}

type ChartCardProps = {
  title: string;
  children: ReactNode;
};

function ChartCard({ title, children }: ChartCardProps) {
  return (
    <Styled.ChartCard>
      <strong>{title}</strong>
      <Styled.ChartFrame>{children}</Styled.ChartFrame>
    </Styled.ChartCard>
  );
}
