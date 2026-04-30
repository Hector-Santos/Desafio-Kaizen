import type { KeyboardEvent, MouseEvent } from 'react';

import type { FactoryMetrics, PieceEvent } from '../game/gameTypes';

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
    <div
      className="factory-stage"
      aria-label="Animated production grid"
      role="button"
      tabIndex={0}
      onClick={handleStageClick}
      onKeyDown={handleStageKeyDown}
    >
      <div className="factory-title-bar">
        <span>Production Line</span>
        <span>Green = good · Red = defect</span>
      </div>

      <div className="factory-hint">
        <span>
          Click the line to produce now. Idle production keeps running at 1Hz.
        </span>
      </div>

      <div className="factory-live-metrics" aria-hidden="true">
        <span>{metrics.speed.toFixed(2)}/s</span>
        <span>{Math.round(metrics.defectRate * 100)}% defects</span>
      </div>

      {pieces.map((piece) => (
        <span
          className={`piece-pop ${piece.status}`}
          key={piece.id}
          style={{ left: `${piece.x}%`, top: `${piece.y}%` }}
          onAnimationEnd={() => onPieceDone(piece.id)}
        />
      ))}
    </div>
  );
}
