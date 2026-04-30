import type { GameState, ImprovementName } from './gameTypes';
import { getUpgradeCost, maxUpgradeLevel, upgrades } from './upgrades';

export function canBuyUpgrade(
  state: GameState,
  upgradeName: ImprovementName,
): boolean {
  const upgrade = upgrades.find((item) => item.name === upgradeName);
  if (!upgrade) return false;

  const level = state.improvements[upgrade.name];
  return (
    level < maxUpgradeLevel &&
    state.points >= getUpgradeCost(upgrade.baseCost, level)
  );
}

export function buyUpgrade(
  state: GameState,
  upgradeName: ImprovementName,
): GameState {
  const upgrade = upgrades.find((item) => item.name === upgradeName);
  if (!upgrade) return state;

  const level = state.improvements[upgrade.name];
  const cost = getUpgradeCost(upgrade.baseCost, level);

  if (level >= maxUpgradeLevel || state.points < cost) return state;

  return {
    ...state,
    points: state.points - cost,
    improvements: {
      ...state.improvements,
      [upgrade.name]: level + 1,
    },
  };
}
