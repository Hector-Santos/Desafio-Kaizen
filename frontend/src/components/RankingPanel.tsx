import { useEffect, useState } from 'react';

import { getTopScores } from '../api/scoresApi';
import type { ScoreRecord } from '../types/scores';

export function RankingPanel() {
  const [scores, setScores] = useState<ScoreRecord[]>([]);

  useEffect(() => {
    let isMounted = true;

    void getTopScores(10).then((records) => {
      if (isMounted) setScores(records);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="panel">
      <h2 className="section-title">Top 10 Ranking</h2>

      <div className="ranking-list">
        {scores.map((score, index) => (
          <div className="ranking-row" key={score.id}>
            <strong>#{index + 1}</strong>
            <span>{score.playerName}</span>
            <strong>{score.score.toLocaleString('en-US')} pts</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
