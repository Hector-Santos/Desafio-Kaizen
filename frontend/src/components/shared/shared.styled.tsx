import styled from 'styled-components';

export const Button = styled.button`
  border: 1px solid var(--border);
  background: var(--panel-soft);
  color: var(--text);
  padding: 10px 14px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: var(--accent);
  }

  &:disabled {
    background: var(--disabled);
    border-color: var(--disabled);
    color: #cbd5e1;
    cursor: not-allowed;
    opacity: 0.62;
  }
`;

export const PrimaryButton = styled(Button)`
  background: var(--accent);
  border-color: var(--accent);
  color: #052e16;
`;

export const Panel = styled.div`
  background: rgba(15, 23, 42, 0.88);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
`;

export const SectionTitle = styled.h2`
  margin: 0 0 14px;
  font-size: 18px;
`;
