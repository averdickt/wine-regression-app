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
  const linePoints = reg.points.map(([x, y]) => ({ x, y }));

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
