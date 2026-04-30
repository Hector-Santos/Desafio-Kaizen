import type { GameState, ImprovementName } from '../../game/gameTypes';
import { getUpgradeCost, maxUpgradeLevel, upgrades } from '../../game/upgrades';
import { Button, SectionTitle } from '../shared/shared.styled';
import * as Styled from './ImprovementsPanel.styled';

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
    <Styled.Aside>
      <SectionTitle>Continuous Improvement</SectionTitle>

      <Styled.List>
        {upgrades.map((upgrade) => {
          const level = game.improvements[upgrade.name];
          const isMaxed = level >= maxUpgradeLevel;
          const cost = getUpgradeCost(upgrade.baseCost, level);

          return (
            <Styled.Card $isMaxed={isMaxed} key={upgrade.name}>
              <Styled.Top>
                <div>
                  <Styled.Name>{upgrade.label}</Styled.Name>
                  <Styled.Effect>{upgrade.effect}</Styled.Effect>
                </div>
                <Styled.Level>
                  {level} / {maxUpgradeLevel}
                </Styled.Level>
              </Styled.Top>

              <Styled.Bottom>
                <Styled.Cost>
                  {isMaxed ? 'Maxed' : `${cost.toLocaleString('en-US')} pts`}
                </Styled.Cost>
                <Button
                  type="button"
                  disabled={!canPurchase(upgrade.name)}
                  onClick={() => onPurchase(upgrade.name)}
                >
                  Buy
                </Button>
              </Styled.Bottom>
            </Styled.Card>
          );
        })}
      </Styled.List>
    </Styled.Aside>
  );
}
