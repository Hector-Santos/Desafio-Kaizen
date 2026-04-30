import styled from 'styled-components';

export const Form = styled.form`
  display: grid;
  gap: 12px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--text);
  font-size: 15px;
  margin-top: 6px;

  &:focus {
    border-color: var(--info);
    outline: none;
  }
`;

export const HelperText = styled.span`
  color: var(--muted);
  font-size: 13px;
  line-height: 1.5;
`;

export const Status = styled.p`
  color: var(--muted);
  font-size: 13px;
  line-height: 1.5;
  margin: 0;
`;
