import { Bar } from "react-chartjs-2";
import { Chart, BarElement, LinearScale, BarController } from "chart.js";
import '../styles/RatingSection.css'
Chart.register(BarElement, LinearScale, BarController);

const BarChart = ({ scores, onBarClick }) => {
  const labels = Object.keys(scores).map(Number);
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Puntuaciones",
        data: Object.values(scores),
        backgroundColor: "rgba(54, 162, 235, 0.6)", // color barras
        borderColor: "rgba(54, 162, 235, 1)", // Color borde
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

export default BarChart;
