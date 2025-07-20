import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Scatter
} from 'recharts';

const RegressionChart = ({ data }) => {
  return (
    <div>
      <h3>Regression Line vs Critic Scores</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="vintage" />
          <YAxis
            yAxisId="left"
            label={{ value: 'Price (£)', angle: -90, position: 'insideLeft' }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{ value: 'Score', angle: -90, position: 'insideRight' }}
          />
          <Tooltip />
          <Legend />
          
          {/* Regression Line (Price) */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="price"
            stroke="#8884d8"
            name="Regression Price"
            dot={false}
          />

          {/* Score Dots */}
          <Scatter
            yAxisId="right"
            name="Score"
            data={data}
            fill="#82ca9d"
            line={false}
            shape="circle"
            dataKey="score"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RegressionChart;
