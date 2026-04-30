import { useEffect, useState } from 'react';

import { getTopScores } from '../../api/scoresApi';
import type { ScoreRecord } from '../../types/scores';
import { Panel, SectionTitle } from '../shared/shared.styled';
import * as Styled from './RankingPanel.styled';

export function RankingPanel() {
  const [scores, setScores] = useState<ScoreRecord[]>([]);
  const [status, setStatus] = useState('Loading ranking...');

  useEffect(() => {
    let isMounted = true;

    void getTopScores(10)
      .then((records) => {
        if (!isMounted) return;

        setScores(records);
        setStatus(records.length > 0 ? '' : 'No scores saved yet.');
      })
      .catch(() => {
        if (isMounted) setStatus('Unable to load ranking.');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Panel>
      <SectionTitle>Top 10 Ranking</SectionTitle>

      <Styled.List>
        {status ? <Styled.EmptyState>{status}</Styled.EmptyState> : null}
        {scores.map((score, index) => (
          <Styled.Row key={score.id}>
            <strong>#{index + 1}</strong>
            <span>{score.playerName}</span>
            <strong>{score.score.toLocaleString('en-US')} pts</strong>
          </Styled.Row>
        ))}
      </Styled.List>
    </Panel>
  );
}
