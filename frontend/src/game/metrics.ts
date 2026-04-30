import { initialDefectRate, initialOee, initialSpeed } from './constants';
import type { FactoryMetrics, ImprovementLevels } from './gameTypes';

export function getFactoryMetrics(
  improvements: ImprovementLevels,
): FactoryMetrics {
  const speed =
    initialSpeed *
    1.1 ** improvements['5S'] *
    1.2 ** improvements.Kanban *
    (improvements.Heijunka > 0 ? 1 + improvements.Heijunka * 0.04 : 1);

  const defectRate =
    initialDefectRate *
    0.95 ** improvements['5S'] *
    0.85 ** improvements['Poka-Yoke'] *
    0.9 ** improvements.TPM;

  const oee =
    initialOee + improvements.TPM * 0.15 + improvements.Heijunka * 0.25;

  return {
    speed,
    defectRate: clamp(defectRate, 0.01, 0.95),
    oee: clamp(oee, 0, 1),
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
