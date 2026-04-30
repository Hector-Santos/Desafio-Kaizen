import * as Styled from './OeeGauge.styled';

type OeeGaugeProps = {
  value: number;
};

export function OeeGauge({ value }: OeeGaugeProps) {
  const boundedValue = Math.min(100, Math.max(0, value));

  return (
    <Styled.GaugeWrap>
      <Styled.Gauge aria-label={`OEE ${boundedValue}%`}>
        <Styled.Arc $value={boundedValue} />
        <Styled.Center>
          <Styled.Value>{boundedValue}%</Styled.Value>
          <Styled.Label>Overall Equipment Effectiveness</Styled.Label>
        </Styled.Center>
      </Styled.Gauge>
    </Styled.GaugeWrap>
  );
}
