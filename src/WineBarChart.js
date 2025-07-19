import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line
} from 'recharts';

const WineScoreBarChart = ({ data }) => {
  return (
    <div style={{ marginTop: 40 }}>
      <h3>Price vs Score by Vintage</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis yAxisId="left" label={{ value: 'Price (£)', angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="right" orientation="right" label={{ value: 'Score', angle: -90, position: 'insideRight' }} />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="price" fill="#8884d8" name="Price (£)" />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="score"
            stroke="#82ca9d"
            dot={{ r: 5 }}
            activeDot={{ r: 8 }}
            name="Score"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WineScoreBarChart;
