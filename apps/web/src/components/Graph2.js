import React from 'react';
import {
  ComposedChart, Bar, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell
} from 'recharts';
import { wineData, calculateRegression } from '../utils';

const Graph2 = ({ selectedWine }) => {
  const today = new Date();

  const wineFiltered = wineData.filter(w => w.product === selectedWine);

  const colorBar = (item) => {
    const daStart = new Date(item.DAStart);
    const daFinish = new Date(item.DAFinish);

    if (today > daFinish) {
      const diffYears = (today - daFinish) / (1000 * 60 * 60 * 24 * 365);
      return `rgb(${Math.min(255, 200 + diffYears * 10)}, 0, 0)`; // darker red further out
    }
    if (today < daStart) {
      const diffYears = (daStart - today) / (1000 * 60 * 60 * 24 * 365);
      return `rgb(255, ${Math.min(255, 200 + diffYears * 10)}, 0)`; // darker yellow further away
    }
    // In drinking window
    const totalWindow = (daFinish - daStart) / (1000 * 60 * 60 * 24 * 365);
    const fromStart = (today - daStart) / (1000 * 60 * 60 * 24 * 365);
    const midPoint = totalWindow / 2;
    const distanceFromMid = Math.abs(fromStart - midPoint);
    const greenValue = Math.min(255, 255 - distanceFromMid * 20);
    return `rgb(0, ${greenValue}, 0)`; // darkest green at middle
  };

  return (
    <ComposedChart
      width={700}
      height={400}
      data={wineFiltered}
      syncId="wineCharts"
    >
      <CartesianGrid stroke="#f5f5f5" />
      <XAxis dataKey="year" />
      <YAxis yAxisId="left" dataKey="price" name="Price (£)" />
      <YAxis yAxisId="right" orientation="right" dataKey="score" name="Score" />
      <Tooltip />
      <Legend />
      <Bar yAxisId="left" dataKey="price" name="Price">
        {wineFiltered.map((item, index) => (
          <Cell key={`cell-${index}`} fill={colorBar(item)} />
        ))}
      </Bar>
      <Scatter yAxisId="right" dataKey="score" fill="#0000ff" name="Score" />
    </ComposedChart>
  );
};

export default Graph2;
