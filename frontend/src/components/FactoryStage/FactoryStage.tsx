import type { KeyboardEvent, MouseEvent } from 'react';

import type { FactoryMetrics, PieceEvent } from '../../game/gameTypes';
import * as Styled from './FactoryStage.styled';

type FactoryStageProps = {
  metrics: FactoryMetrics;
  pieces: PieceEvent[];
  onProduce: (x: number, y: number) => void;
  onPieceDone: (id: number) => void;
};

export function FactoryStage({
  metrics,
  pieces,
  onProduce,
  onPieceDone,
}: FactoryStageProps) {
  function handleStageClick(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    onProduce(x, y);
  }

  function handleStageKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    onProduce(50, 50);
  }

  return (
    <Styled.Stage
      aria-label="Animated production grid"
      role="button"
      tabIndex={0}
      onClick={handleStageClick}
      onKeyDown={handleStageKeyDown}
    >
      <Styled.TitleBar>
        <span>Production Line</span>
        <span>Green = good · Red = defect</span>
      </Styled.TitleBar>

      <Styled.Hint>
        <span>
          Click the line to produce now. Idle production keeps running at 1Hz.
        </span>
      </Styled.Hint>

      <Styled.LiveMetrics aria-hidden="true">
        <span>{metrics.speed.toFixed(2)}/s</span>
        <span>{Math.round(metrics.defectRate * 100)}% defects</span>
      </Styled.LiveMetrics>

      {pieces.map((piece) => (
        <Styled.Piece
          key={piece.id}
          $status={piece.status}
          style={{ left: `${piece.x}%`, top: `${piece.y}%` }}
          onAnimationEnd={() => onPieceDone(piece.id)}
        />
      ))}
    </Styled.Stage>
  );
}
