// components/ScoreDistribution.tsx

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ScoreDistributionProps {
  scores: number[];
}

const ScoreDistribution: React.FC<ScoreDistributionProps> = ({ scores }) => {
  // Example data transformation to group scores by ranges
  const scoreRanges = [700, 750, 800, 850, 900, 950, 1000, 1050, 1100, 1150, 1200, 1250, 1300, 1350, 1400, 1450, 1500, 1550, 1600];
  const scoreCounts = scoreRanges.map((range) =>
    scores.filter(score => score >= range && score < range + 50).length
  );

  const data = {
    labels: scoreRanges.map(range => `${range}-${range + 50}`),
    datasets: [
      {
        label: 'Frequency',
        data: scoreCounts,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Score Distribution',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Score',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Frequency',
        },
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options}/>;
};

export default ScoreDistribution;
