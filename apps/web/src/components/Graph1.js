// apps/web/components/Graph1.js
import React from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line
} from 'recharts';

export default function Graph1({ data, regression }) {
  if (!data || data.length === 0 || !regression) {
    return <p>No data to display.</p>;
  }

  // get min score from dataset
  const minScore = Math.min(...data.map(d => parseFloat(d.score)));
  const xMin = Math.max(minScore - 3, 0); // never below 0

  return (
    <ScatterChart
      width={800}
      height={500}
      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
    >
      <CartesianGrid />
      <XAxis
        type="number"
        dataKey="score"
        name="Score"
        domain={[xMin, 'dataMax']}
      />
      <YAxis
        type="number"
        dataKey="price"
        name="Price"
      />
      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
      <Legend />

      {/* Scatter points */}
      <Scatter name="Wine Data" data={data} fill="#8884d8" />

      {/* Regression line */}
      <Line
        type="monotone"
        dataKey="price"
        data={regression.points}
        stroke="#ff7300"
        dot={false}
        name="Regression Line"
      />
    </ScatterChart>
  );
}
