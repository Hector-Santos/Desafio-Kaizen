import type { GameState, ImprovementName } from '../game/gameTypes';
import { getUpgradeCost, maxUpgradeLevel, upgrades } from '../game/upgrades';

type ImprovementsPanelProps = {
  game: GameState;
  canPurchase: (upgradeName: ImprovementName) => boolean;
  onPurchase: (upgradeName: ImprovementName) => void;
};

export function ImprovementsPanel({
  game,
  canPurchase,
  onPurchase,
}: ImprovementsPanelProps) {
  return (
    <aside className="panel">
      <h2 className="section-title">Continuous Improvement</h2>

      <div className="improvements-list">
        {upgrades.map((upgrade) => {
          const level = game.improvements[upgrade.name];
          const isMaxed = level >= maxUpgradeLevel;
          const cost = getUpgradeCost(upgrade.baseCost, level);

          return (
            <article
              className={`upgrade-card ${isMaxed ? 'maxed' : ''}`}
              key={upgrade.name}
            >
              <div className="upgrade-top">
                <div>
                  <h3 className="upgrade-name">{upgrade.label}</h3>
                  <p className="upgrade-effect">{upgrade.effect}</p>
                </div>
                <span className="upgrade-level">
                  {level} / {maxUpgradeLevel}
                </span>
              </div>

              <div className="upgrade-bottom">
                <span className="cost">
                  {isMaxed ? 'Maxed' : `${cost.toLocaleString('en-US')} pts`}
                </span>
                <button
                  className="button"
                  type="button"
                  disabled={!canPurchase(upgrade.name)}
                  onClick={() => onPurchase(upgrade.name)}
                >
                  Buy
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </aside>
  );
}
