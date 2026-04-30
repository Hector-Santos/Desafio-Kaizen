import styled from 'styled-components';

export const List = styled.div`
  display: grid;
  gap: 10px;
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr auto;
  gap: 10px;
  align-items: center;
  padding: 12px;
  background: var(--panel-soft);
  border: 1px solid var(--border);
  border-radius: 8px;
`;
