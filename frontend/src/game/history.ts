import { initialOee, maxChartPoints } from './constants';
import type { ChartPoint, GameState } from './gameTypes';
import { getFactoryMetrics } from './metrics';

export function createInitialHistory(): ChartPoint[] {
  return Array.from({ length: 16 }, (_, index) => ({
    label: `${index}s`,
    second: index,
    production: 0,
    defectsPerMinute: 0,
    oee: Math.round(initialOee * 100),
  }));
}

export function appendHistoryPoint(
  state: GameState,
  recentDefectTicks = state.recentDefectTicks,
): ChartPoint[] {
  const metrics = getFactoryMetrics(state.improvements);
  const defectsPerMinute = recentDefectTicks.reduce(
    (total, value) => total + value,
    0,
  );

  return [
    ...state.history,
    {
      label: 'now',
      second: state.elapsedSeconds,
      production: state.goodPieces,
      defectsPerMinute,
      oee: Math.round(metrics.oee * 100),
    },
  ]
    .filter((point) => point.second >= state.elapsedSeconds - 60)
    .slice(-maxChartPoints);
}

export function createRelativeLabels(points: ChartPoint[]): string[] {
  const latestSecond = points[points.length - 1]?.second ?? 0;

  return points.map((point) => {
    const age = latestSecond - point.second;
    return age <= 0 ? 'now' : `-${age}s`;
  });
}

export function getVisibleChartPoints(points: ChartPoint[]): ChartPoint[] {
  const latestSecond = points[points.length - 1]?.second ?? 0;
  const lastMinute = points.filter(
    (point) => point.second >= latestSecond - 60,
  );

  if (lastMinute.length <= 25) return lastMinute;

  const step = (lastMinute.length - 1) / 24;

  return Array.from({ length: 25 }, (_, index) => {
    const pointIndex = Math.round(index * step);
    return lastMinute[pointIndex];
  });
}
