import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell
} from 'recharts';
import { wineData, calculateRegression } from '../utils';

const Graph4 = ({ selectedWine }) => {
  const today = new Date();

  const wineFiltered = wineData.filter(w => w.product === selectedWine);

  // Get axis bounds: 5 years before earliest DAStart, 5 years after latest DAFinish
  const minDAStart = Math.min(...wineFiltered.map(w => new Date(w.DAStart).getFullYear()));
  const maxDAFinish = Math.max(...wineFiltered.map(w => new Date(w.DAFinish).getFullYear()));

  const xMin = minDAStart - 5;
  const xMax = maxDAFinish + 5;

  const getBarColor = (item) => {
    const daStart = new Date(item.DAStart);
    const daFinish = new Date(item.DAFinish);

    if (today < daStart) {
      const diff = (daStart - today) / (1000 * 60 * 60 * 24 * 365);
      return `rgb(255, ${Math.max(200 - diff * 10, 100)}, 0)`; // yellow gradation
    }
    if (today > daFinish) {
      const diff = (today - daFinish) / (1000 * 60 * 60 * 24 * 365);
      return `rgb(${Math.max(200 - diff * 10, 100)}, 0, 0)`; // red gradation
    }
    // Inside drinking window
    const totalWindow = (daFinish - daStart) / (1000 * 60 * 60 * 24 * 365);
    const fromStart = (today - daStart) / (1000 * 60 * 60 * 24 * 365);
    const midPoint = totalWindow / 2;
    const distFromMid = Math.abs(fromStart - midPoint);
    const greenValue = Math.max(100, 255 - distFromMid * 20);
    return `rgb(0, ${greenValue}, 0)`; // green gradation
  };

  return (
    <BarChart
      width={700}
      height={400}
      data={wineFiltered}
      layout="vertical"
      margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis type="number" domain={[xMin, xMax]} label={{ value: 'Year', position: 'insideBottomRight', offset: -5 }} />
      <YAxis type="category" dataKey="year" />
      <Tooltip />
      <Bar dataKey="drinkingYears" isAnimationActive={false}>
        {wineFiltered.map((item, index) => (
          <Cell key={`cell-${index}`} fill={getBarColor(item)} />
        ))}
      </Bar>
    </BarChart>
  );
};

export default Graph4;
