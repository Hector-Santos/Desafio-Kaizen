import styled from 'styled-components';

export const GaugeWrap = styled.div`
  height: 100%;
  display: grid;
  place-items: center;
`;

export const Gauge = styled.div`
  width: min(280px, 100%);
  aspect-ratio: 2 / 1;
  position: relative;
  overflow: hidden;
`;

export const Arc = styled.div<{ $value: number }>`
  position: absolute;
  inset: 0;
  border-radius: 999px 999px 0 0;
  background:
    radial-gradient(
      circle at 50% 100%,
      rgba(2, 6, 23, 1) 0 52%,
      transparent 53%
    ),
    conic-gradient(
      from 270deg at 50% 100%,
      var(--info) 0deg ${({ $value }) => $value * 1.8}deg,
      rgba(148, 163, 184, 0.18) ${({ $value }) => $value * 1.8}deg 180deg,
      transparent 180deg 360deg
    );
`;

export const Center = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  justify-items: center;
  gap: 4px;
`;

export const Value = styled.strong`
  font-size: 34px;
  line-height: 1;
`;

export const Label = styled.span`
  color: var(--muted);
  font-size: 13px;
  font-weight: 700;
`;
