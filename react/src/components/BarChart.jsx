import { Bar } from "react-chartjs-2";
import { Chart, BarElement, LinearScale, BarController } from "chart.js";

Chart.register(BarElement, LinearScale, BarController);

// --- COMPONENTE 1: Gráfico con Chart.js ---
const BarChart = ({ scores, onBarClick }) => {
  const labels = Object.keys(scores).map(Number);
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Puntuaciones",
        data: Object.values(scores),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: "linear",
        ticks: {
          stepSize: 1,
        },
      },
      y: {
        ticks: {
          beginAtZero: true,
          stepSize: 1,
        },
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const clickedIndex = elements[0].index;
        const label = data.labels[clickedIndex];
        const value = data.datasets[0].data[clickedIndex];
        onBarClick(label, value);
      }
    },
  };

  return (
    <div className="bar-chart-container">
      <Bar data={data} options={options} />
    </div>
  );
};

// --- COMPONENTE 2: Barras Horizontales---
export function HorizontalBars({ scores, onBarClick, activeValue }) {
  const entries = Object.entries(scores).map(([k, v]) => [Number(k), v]);
  const maxCount = Math.max(...entries.map(([, v]) => v));

  return (
    <div className="hbar-wrapper">
      <p className="hbar-label">PUNTUACIONES</p>
      {entries.map(([stars, count]) => (
        <div
          key={stars}
          className={`hbar-row${activeValue === stars ? " hbar-row--active" : ""}`}
          onClick={() => onBarClick(stars, count)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onBarClick(stars, count); }}
          aria-label={`${stars} estrellas, ${count} juegos`}
        >
          <span className="hbar-star">{stars}</span>
          <div className="hbar-track">
            <div
              className="hbar-fill"
              style={{ width: `${Math.round((count / maxCount) * 100)}%` }}
            />
          </div>
          <span className="hbar-count">{count}</span>
        </div>
      ))}
    </div>
  );
}

export default BarChart;