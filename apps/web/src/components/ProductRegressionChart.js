import React from "react";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Line
} from "recharts";
import { bestFitRegression } from "../lib/Regression";

export default function ProductRegressionChart({ data, highlightVintage }) {
  if (!data || data.length === 0) return null;

  const formattedData = data.map(d => ({ x: d.Score, y: d.Price, vintage: d.Vintage }));

  // Regression calculation
  const reg = bestFitRegression(formattedData.map(d => [d.x, d.y]));

  // Generate smooth line across the domain
  const xMin = Math.min(...formattedData.map(d => d.x)) - 1;
  const xMax = 100;
  const step = (xMax - xMin) / 50; // 50 points for smooth curve
  
  const linePoints = [];
  for (let x = xMin; x <= xMax; x += step) {
    const y = reg.predict(x)[1];
    linePoints.push({ x, y });
  }
  console.log("Regression line points:", linepoints);
  return (
    <ScatterChart width={600} height={400}>
      <CartesianGrid />
      <XAxis type="number" dataKey="x" name="Score" domain={['dataMin - 1',100]}/>
      <YAxis type="number" dataKey="y" name="Price" />
      <Tooltip cursor={{ strokeDasharray: "3 3" }} />

      <Scatter
        name="Data"
        data={formattedData}
        fill="#8884d8"
        shape={(props) => {
          const { cx, cy, payload } = props;
          return (
            <circle
              cx={cx}
              cy={cy}
              r={highlightVintage && payload.vintage === highlightVintage ? 8 : 4}
              fill={highlightVintage && payload.vintage === highlightVintage ? "red" : "#8884d8"}
            />
          );
        }}
      />

      <Line type="monotone" dataKey="y" data={linePoints} stroke="green" dot={false} />
    </ScatterChart>
  );
}
