import styled from 'styled-components';

export const AppShell = styled.main`
  width: min(1200px, 100%);
  margin: 0 auto;
  padding: 24px;

  @media (max-width: 560px) {
    padding: 16px;
  }
`;

export const Layout = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(320px, 0.55fr);
  gap: 20px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const SecondaryLayout = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;
