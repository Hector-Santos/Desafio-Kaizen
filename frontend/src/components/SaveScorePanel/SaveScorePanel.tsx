import { useState } from 'react';

import { getPlayerRank, saveScore } from '../../api/scoresApi';
import type { GameState } from '../../game/gameTypes';
import { Panel, PrimaryButton, SectionTitle } from '../shared/shared.styled';
import * as Styled from './SaveScorePanel.styled';

type SaveScorePanelProps = {
  game: GameState;
};

export function SaveScorePanel({ game }: SaveScorePanelProps) {
  const [playerName, setPlayerName] = useState('');
  const [status, setStatus] = useState('Score is ready to submit.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    const trimmedName = playerName.trim();

    if (!trimmedName) {
      setStatus('Enter a player name before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await saveScore({
        playerName: trimmedName,
        score: Math.floor(game.points),
        improvements: game.improvements,
        elapsedSeconds: Math.max(1, game.elapsedSeconds),
      });
      const rank = await getPlayerRank(trimmedName);
      const rankText = rank.rank ? ` Current rank: #${rank.rank}.` : '';
      setStatus(
        result.saved
          ? `Score saved.${rankText}`
          : `Stored score is higher.${rankText}`,
      );
    } catch {
      setStatus('Score rejected by the backend validation.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Panel>
      <SectionTitle>Save Score</SectionTitle>

      <Styled.Form>
        <label>
          <Styled.HelperText>Player name</Styled.HelperText>
          <Styled.Input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(event) => setPlayerName(event.target.value)}
          />
        </label>

        <label>
          <Styled.HelperText>Current score</Styled.HelperText>
          <Styled.Input
            type="text"
            value={`${Math.floor(game.points).toLocaleString('en-US')} pts`}
            readOnly
          />
        </label>

        <PrimaryButton
          type="button"
          disabled={isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Score'}
        </PrimaryButton>

        <Styled.Status>{status}</Styled.Status>
      </Styled.Form>
    </Panel>
  );
}
