import { useState } from 'react';

import { getPlayerRank, saveScore } from '../api/scoresApi';
import type { GameState } from '../game/gameTypes';

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
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="panel">
      <h2 className="section-title">Save Score</h2>

      <form className="save-form">
        <label>
          <span className="helper-text">Player name</span>
          <input
            className="input"
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(event) => setPlayerName(event.target.value)}
          />
        </label>

        <label>
          <span className="helper-text">Current score</span>
          <input
            className="input"
            type="text"
            value={`${Math.floor(game.points).toLocaleString('en-US')} pts`}
            readOnly
          />
        </label>

        <button
          className="button primary"
          type="button"
          disabled={isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Score'}
        </button>

        <p className="helper-text">{status}</p>
      </form>
    </div>
  );
}
