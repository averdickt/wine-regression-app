import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Scatter,
} from "recharts";
import { bestFitRegression } from "../lib/Regression";

export default function ProductRegressionChart({ data, highlightVintage }) {
  if (!data || data.length === 0) return null;

  const formattedData = data.map((d) => ({
    x: Number(d.Score),     // ensure numeric
    y: Number(d.Price),     // ensure numeric
    vintage: d.Vintage,
  }));

  // Regression calculation
  const reg = bestFitRegression(formattedData.map((d) => [d.x, d.y]));

  // Generate smooth regression line
  const xMin = Math.min(...formattedData.map((d) => d.x)) - 1;
  const xMax = 100;
  const step = (xMax - xMin) / 50;
  const linePoints = [];
  for (let x = xMin; x <= xMax; x += step) {
    const y = reg.predict(x)[1];
    linePoints.push({ x, y });
  }

  return (
    <LineChart width={600} height={400}>
      <CartesianGrid />
      <XAxis
        type="number"
        dataKey="x"
        name="Score"
        domain={["dataMin - 1", 100]}
      />
      <YAxis type="number" dataKey="y" name="Price" />
      <Tooltip cursor={{ strokeDasharray: "3 3" }} />

      {/* Scatter points */}
      <Scatter
        name="Data"
        data={formattedData}
        xAxisId={0}
        yAxisId={0}
        dataKey="y"
        fill="#8884d8"
        shape={(props) => {
          const { cx, cy, payload } = props;
          const isHighlighted =
            highlightVintage &&
            String(payload.vintage) === String(highlightVintage);
          return (
            <circle
              cx={cx}
              cy={cy}
              r={isHighlighted ? 8 : 4}
              fill={isHighlighted ? "red" : "#8884d8"}
            />
          );
        }}
      />

      {/* Regression line */}
      <Line
        type="monotone"
        data={linePoints}
        dataKey="y"
        stroke="green"
        dot={false}
        isAnimationActive={false}
      />
    </LineChart>
  );
}
