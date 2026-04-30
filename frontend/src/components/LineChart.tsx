import {
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
} from 'chart.js';
import { useEffect, useRef } from 'react';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Legend,
);

type LineChartProps = {
  title: string;
  labels: string[];
  values: number[];
  color: string;
  fill: string;
};

export function LineChart({
  title,
  labels,
  values,
  color,
  fill,
}: LineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart<'line', number[], string> | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    chartRef.current = new Chart(canvas, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: '',
            data: [],
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34, 197, 94, 0.16)',
            borderWidth: 3,
            pointRadius: 3,
            tension: 0.35,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 250 },
        plugins: {
          legend: {
            labels: { color: '#e5e7eb' },
          },
        },
        scales: {
          x: {
            ticks: { color: '#94a3b8', maxTicksLimit: 8 },
            grid: { color: 'rgba(148, 163, 184, 0.14)' },
          },
          y: {
            beginAtZero: true,
            ticks: { color: '#94a3b8' },
            grid: { color: 'rgba(148, 163, 184, 0.14)' },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    chart.data.labels = labels;
    chart.data.datasets[0].label = title;
    chart.data.datasets[0].data = values;
    chart.data.datasets[0].borderColor = color;
    chart.data.datasets[0].backgroundColor = fill;
    chart.update();
  }, [color, fill, labels, title, values]);

  return <canvas ref={canvasRef} />;
}
