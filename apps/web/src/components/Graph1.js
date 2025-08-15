import React from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line
} from 'recharts';
import { wineData } from 'utils/data';
import { filterWineData, calculateRegression } from '../utils/regression';

const Graph1 = ({ selectedProduct }) => {
  // Filter for only the product we care about
  const productData = filterWineData(wineData, selectedProduct);

  // Calculate regression from the score vs price
  const regressionPoints = calculateRegression(productData, 'score', 'price');

  return (
    <ScatterChart
      width={800}
      height={500}
      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
    >
      <CartesianGrid />
      <XAxis type="number" dataKey="score" name="Score" />
      <YAxis type="number" dataKey="price" name="Price" />
      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
      <Legend />

      {/* Scatter plot of actual data points */}
      <Scatter name={selectedProduct} data={productData} fill="#8884d8" />

      {/* Regression line */}
      <Line
        type="monotone"
        data={regressionPoints}
        dataKey="y"
        stroke="#ff7300"
        dot={false}
        isAnimationActive={false}
      />
    </ScatterChart>
  );
};

export default Graph1;
