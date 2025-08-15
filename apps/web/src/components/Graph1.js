import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Scatter } from 'recharts';
import regression from 'regression';
import wineData from '../utils';

export default function Graph1({ selectedProduct, selectedVintage, tickWineClass }) {
  // Filter
  let filtered = wineData.filter(row => {
    if (selectedProduct && row.Product !== selectedProduct) return false;
    return true;
  });

  // Optional WineClass filter
  if (tickWineClass) {
    filtered = filtered.filter(row => row.WineClass === wineData.find(w => w.Product === selectedProduct)?.WineClass);
  }

  // Prepare regression data
  const points = filtered.map(row => [row.Score, row.Price]);
  const regResult = regression.linear(points);
  const regLine = points.map(([x]) => ({ Score: x, Price: regResult.predict(x)[1] }));

  return (
    <div>
      <h3>Graph 1: Regression (Score vs Price)</h3>
      <LineChart width={700} height={400} data={filtered}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Score" />
        <YAxis dataKey="Price" />
        <Tooltip />
        <Scatter dataKey="Price" fill="#8884d8" />
        <Line data={regLine} type="monotone" dataKey="Price" stroke="#ff7300" dot={false} />
      </LineChart>
    </div>
  );
}
