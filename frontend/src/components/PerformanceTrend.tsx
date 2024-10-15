import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PerformanceTrendProps {
  data: {
    period: string;
    gpa: number;
  }[];
}

const PerformanceTrend: React.FC<PerformanceTrendProps> = ({ data }) => {
  return (
    <div className="performance-trend">
      <h2 className="text-center mb-4">Students Performance for the Past 4 Academic Years</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis domain={[65, 90]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="gpa" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-center mt-4">Average Score: {calculateAverage(data)}</p>
    </div>
  );
};

// Helper function to calculate the average score
const calculateAverage = (data: { period: string; gpa: number }[]) => {
  const totalGpa = data.reduce((acc, curr) => acc + curr.gpa, 0);
  return (totalGpa / data.length).toFixed(2);
};

export default PerformanceTrend;
