import * as Styled from './StatCard.styled';

type StatCardProps = {
  label: string;
  value: string;
};

export function StatCard({ label, value }: StatCardProps) {
  return (
    <Styled.Card>
      <Styled.Label>{label}</Styled.Label>
      <Styled.Value>{value}</Styled.Value>
    </Styled.Card>
  );
}
