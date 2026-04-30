import { useEffect, useRef } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Legend,
} from "chart.js";
import "./App.css";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Legend,
);

const upgrades = [
  { name: "5S", effect: "−5% defects, +10% speed.", cost: "50 pts" },
  { name: "Kanban", effect: "+20% production speed.", cost: "200 pts" },
  { name: "Poka-Yoke", effect: "−15% defects.", cost: "500 pts" },
  { name: "TPM", effect: "+15% OEE, −10% defects.", cost: "1,500 pts" },
  { name: "Andon", effect: "Unlocks auto-recovery from stoppages.", cost: "4,000 pts" },
  { name: "Heijunka", effect: "Levels production, +25% OEE.", cost: "10,000 pts" },
];

export default function App() {
  const factoryStageRef = useRef<HTMLDivElement | null>(null);
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const factoryStage = factoryStageRef.current;
    if (!factoryStage) return;

    function spawnPiece() {
      if (!factoryStage) return;

      const piece = document.createElement("span");
      const isGoodPiece = Math.random() > 0.3;

      piece.className = `piece-pop ${isGoodPiece ? "good" : "bad"}`;

      const x = 24 + Math.random() * (factoryStage.clientWidth - 48);
      const y = 58 + Math.random() * (factoryStage.clientHeight - 88);

      piece.style.left = `${x}px`;
      piece.style.top = `${y}px`;

      factoryStage.appendChild(piece);

      window.setTimeout(() => piece.remove(), 1200);
    }

    const intervalId = window.setInterval(spawnPiece, 420);
    const timeoutIds = Array.from({ length: 8 }, (_, index) =>
      window.setTimeout(spawnPiece, index * 140),
    );

    return () => {
      window.clearInterval(intervalId);
      timeoutIds.forEach(window.clearTimeout);
    };
  }, []);

  useEffect(() => {
    const canvas = chartCanvasRef.current;
    if (!canvas) return;

    const labels = Array.from({ length: 16 }, (_, index) => `${index}s`);
    const values = [0, 1, 2, 4, 5, 7, 8, 11, 13, 14, 17, 19, 22, 25, 27, 31];

    const chart = new Chart(canvas, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Good pieces produced",
            data: values,
            borderColor: "#22c55e",
            backgroundColor: "rgba(34, 197, 94, 0.16)",
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
        animation: { duration: 500 },
        plugins: {
          legend: {
            labels: { color: "#e5e7eb" },
          },
        },
        scales: {
          x: {
            ticks: { color: "#94a3b8" },
            grid: { color: "rgba(148, 163, 184, 0.14)" },
          },
          y: {
            beginAtZero: true,
            ticks: { color: "#94a3b8" },
            grid: { color: "rgba(148, 163, 184, 0.14)" },
          },
        },
      },
    });

    let second = 16;
    let total = values[values.length - 1];

    const intervalId = window.setInterval(() => {
      second += 1;
      total += Math.floor(Math.random() * 4) + 1;

      chart.data.labels?.push(`${second}s`);
      chart.data.datasets[0].data.push(total);

      if (chart.data.labels && chart.data.labels.length > 16) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
      }

      chart.update();
    }, 1200);

    return () => {
      window.clearInterval(intervalId);
      chart.destroy();
    };
  }, []);

  return (
    <main className="app">
      <header className="app-header">
        <div className="brand">
          <h1>Kaizen Clicker</h1>
          <p>Optimize your factory line, reduce defects, and climb the ranking.</p>
        </div>

        <div className="header-actions">
          <button className="button">Ranking</button>
          <button className="button primary">Save Score</button>
        </div>
      </header>

      <section className="layout">
        <div className="panel">
          <h2 className="section-title">Factory Floor</h2>

          <div
            ref={factoryStageRef}
            className="factory-stage"
            aria-label="Animated production grid"
          >
            <div className="factory-title-bar">
              <span>Production Line</span>
              <span>Green = good · Red = defect</span>
            </div>

            <div className="factory-hint">
              <span>Pieces appear across the line as production ticks happen.</span>
            </div>
          </div>

          <div className="stats-grid">
            <StatCard label="Kaizen Points" value="0" />
            <StatCard label="Production Speed" value="1/s" />
            <StatCard label="Defect Rate" value="30%" />
            <StatCard label="OEE" value="40%" />
          </div>

          <div className="dashboard">
            <article className="chart-card">
              <strong>Accumulated Production</strong>
              <div className="chart-placeholder chart-filled">
                <canvas ref={chartCanvasRef} />
              </div>
            </article>

            <article className="chart-card">
              <strong>Defects per Minute</strong>
              <div className="chart-placeholder">Bar/line chart container</div>
            </article>

            <article className="chart-card">
              <strong>OEE</strong>
              <div className="chart-placeholder">Gauge/line chart container</div>
            </article>
          </div>
        </div>

        <aside className="panel">
          <h2 className="section-title">Continuous Improvement</h2>

          <div className="improvements-list">
            {upgrades.map((upgrade) => (
              <article className="upgrade-card" key={upgrade.name}>
                <div className="upgrade-top">
                  <div>
                    <h3 className="upgrade-name">{upgrade.name}</h3>
                    <p className="upgrade-effect">{upgrade.effect}</p>
                  </div>
                  <span className="upgrade-level">0 / 5</span>
                </div>

                <div className="upgrade-bottom">
                  <span className="cost">{upgrade.cost}</span>
                  <button className="button" disabled>
                    Buy
                  </button>
                </div>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <section className="secondary-layout">
        <div className="panel">
          <h2 className="section-title">Top 10 Ranking</h2>

          <div className="ranking-list">
            {Array.from({ length: 10 }, (_, index) => (
              <div className="ranking-row" key={index + 1}>
                <strong>#{index + 1}</strong>
                <span>Player name</span>
                <strong>0 pts</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <h2 className="section-title">Save Score</h2>

          <form className="save-form">
            <label>
              <span className="helper-text">Player name</span>
              <input className="input" type="text" placeholder="Enter your name" />
            </label>

            <label>
              <span className="helper-text">Current score</span>
              <input className="input" type="text" value="0 pts" readOnly />
            </label>

            <button className="button primary" type="button">
              Submit Score
            </button>

            <p className="helper-text">
              The backend will validate player name uniqueness and score plausibility.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}

type StatCardProps = {
  label: string;
  value: string;
};

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}