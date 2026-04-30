import styled from 'styled-components';

export const Dashboard = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-top: 20px;
`;

export const ChartCard = styled.article`
  min-height: 260px;
  padding: 16px;
  background: var(--panel-soft);
  border: 1px solid var(--border);
  border-radius: 8px;
`;

export const ChartFrame = styled.div`
  height: 200px;
  border-radius: 8px;
  border: 1px solid var(--border);
  display: block;
  color: var(--muted);
  margin-top: 12px;
  padding: 12px;
  background: rgba(2, 6, 23, 0.55);

  canvas {
    width: 100%;
    height: 100%;
  }
`;
