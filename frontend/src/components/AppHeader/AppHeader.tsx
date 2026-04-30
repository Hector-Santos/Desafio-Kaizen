import { Button, PrimaryButton } from '../shared/shared.styled';
import * as Styled from './AppHeader.styled';

type AppHeaderProps = {
  onRankingClick: () => void;
  onSaveClick: () => void;
};

export function AppHeader({ onRankingClick, onSaveClick }: AppHeaderProps) {
  return (
    <Styled.Header>
      <Styled.Brand>
        <h1>eKaisen Clicker</h1>
        <p>
          Optimize your factory line, reduce defects, and climb the ranking.
        </p>
      </Styled.Brand>

      <Styled.Actions>
        <Button type="button" onClick={onRankingClick}>
          Ranking
        </Button>
        <PrimaryButton type="button" onClick={onSaveClick}>
          Save Score
        </PrimaryButton>
      </Styled.Actions>
    </Styled.Header>
  );
}
