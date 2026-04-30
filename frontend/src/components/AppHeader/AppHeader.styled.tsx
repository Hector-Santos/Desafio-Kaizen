import styled from 'styled-components';

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  margin-bottom: 24px;

  @media (max-width: 900px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const Brand = styled.div`
  h1 {
    margin: 0;
    font-size: 32px;
  }

  p {
    margin: 6px 0 0;
    color: var(--muted);
  }
`;

export const Actions = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 560px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;
