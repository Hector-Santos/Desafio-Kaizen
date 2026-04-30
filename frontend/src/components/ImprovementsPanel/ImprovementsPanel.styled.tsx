import styled from 'styled-components';

import { Panel } from '../shared/shared.styled';

export const Aside = styled(Panel).attrs({ as: 'aside' })``;

export const List = styled.div`
  display: grid;
  gap: 12px;
`;

export const Card = styled.article<{ $isMaxed: boolean }>`
  display: grid;
  gap: 10px;
  padding: 14px;
  background: var(--panel-soft);
  border: 1px solid
    ${({ $isMaxed }) => ($isMaxed ? 'rgba(34, 197, 94, 0.5)' : 'var(--border)')};
  border-radius: 8px;
`;

export const Top = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: start;
`;

export const Name = styled.h3`
  margin: 0;
  font-size: 16px;
`;

export const Effect = styled.p`
  margin: 4px 0 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.35;
`;

export const Level = styled.span`
  color: var(--accent);
  font-size: 13px;
  font-weight: 800;
  white-space: nowrap;
`;

export const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;

export const Cost = styled.span`
  font-weight: 800;
`;
