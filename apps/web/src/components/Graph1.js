import React from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line
} from 'recharts';
import calculateRegression from '../utils/regression';
import wineData from '../utils/data';

const Graph1 = ({ selectedWine }) => {
  // Filter wine data for selected wine only
  const wineFiltered = wineData.filter(w => w.product === selectedWine);

  // Map to (score, price) points
  const data = wineFiltered.map(w => ({
    score: w.score,
    price: w.price
  }));

  // Calculate regression
  const regressionPoints = calculateRegression(data, 'linear');

  return (
    <ScatterChart
      width={600}
      height={400}
      data={data}
      syncId="wineCharts"
    >
      <CartesianGrid />
      <XAxis dataKey="score" name="Score" />
      <YAxis dataKey="price" name="Price (£)" />
      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
      <Legend />
      <Scatter name="Wine Data" data={data} fill="#8884d8" />
      <Line
        type="monotone"
        dataKey="price"
        data={regressionPoints}
        stroke="#ff7300"
        dot={false}
        name="Regression Line"
      />
    </ScatterChart>
  );
};

export default Graph1;
