import styled, { css, keyframes } from 'styled-components';

const piecePop = keyframes`
  0% {
    opacity: 0;
    transform: translate(-50%, calc(-50% + 10px)) scale(0.7);
  }

  18% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }

  100% {
    opacity: 0;
    transform: translate(-50%, calc(-50% - 24px)) scale(0.82);
  }
`;

export const Stage = styled.div`
  min-height: 320px;
  background:
    linear-gradient(90deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px),
    linear-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px);
  background-color: rgba(2, 6, 23, 0.28);
  background-size: 28px 28px;
  border: 1px solid var(--border);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  cursor: crosshair;

  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 3px;
  }
`;

export const TitleBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  min-height: 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0 16px;
  background: linear-gradient(90deg, #1e3a8a, #0369a1);
  border-bottom: 1px solid rgba(191, 219, 254, 0.25);
  color: #dbeafe;
  font-weight: 800;
  letter-spacing: 0.02em;
  z-index: 3;

  span:last-child {
    color: rgba(219, 234, 254, 0.72);
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
  }

  @media (max-width: 560px) {
    min-height: 68px;
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;
  }
`;

export const Hint = styled.div`
  position: absolute;
  inset: 42px 0 0;
  display: grid;
  place-items: center;
  color: rgba(148, 163, 184, 0.35);
  text-align: center;
  pointer-events: none;
  padding: 24px;
  z-index: 1;

  @media (max-width: 560px) {
    inset: 68px 0 0;
  }
`;

export const LiveMetrics = styled.div`
  position: absolute;
  right: 12px;
  bottom: 12px;
  display: flex;
  gap: 8px;
  z-index: 4;

  span {
    border: 1px solid rgba(148, 163, 184, 0.24);
    background: rgba(2, 6, 23, 0.72);
    border-radius: 8px;
    padding: 6px 8px;
    color: #cbd5e1;
    font-size: 12px;
    font-weight: 800;
  }

  @media (max-width: 560px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const Piece = styled.span<{ $status: 'good' | 'bad' }>`
  position: absolute;
  width: 27px;
  height: 27px;
  border-radius: 7px;
  box-shadow: 0 0 18px currentColor;
  animation: ${piecePop} 1.1s ease-out forwards;
  transform: translate(-50%, -50%);
  z-index: 2;

  ${({ $status }) =>
    $status === 'good'
      ? css`
          color: var(--accent);
          background: var(--accent);
        `
      : css`
          color: var(--danger);
          background: var(--danger);
        `}
`;
