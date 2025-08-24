import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Scatter,
  ReferenceLine,
} from "recharts";
import { bestFitRegression } from "../lib/Regression";

export default function ProductRegressionChart({ data, highlightVintage }) {
  if (!data || data.length === 0) return null;

  const formattedData = data.map((d) => ({
    x: Number(d.Score),     // Score
    y: Number(d.Price),     // Price
    vintage: d.Vintage,     // Keep vintage
  }));

  // Calculate regression
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

      {/* Custom tooltip to include Vintage */}
      <Tooltip
        cursor={{ strokeDasharray: "3 3" }}
        formatter={(value, name, props) => {
          if (name === "y") return [`$${value}`, "Price"];
          if (name === "x") return [value, "Score"];
          return value;
        }}
        labelFormatter={() => ""}
        content={({ active, payload }) => {
          if (active && payload && payload.length) {
            const point = payload[0].payload;
            return (
              <div
                style={{
                  background: "white",
                  border: "1px solid #ccc",
                  padding: "5px",
                }}
              >
                <div><b>Vintage:</b> {point.vintage}</div>
                <div><b>Score:</b> {point.x}</div>
                <div><b>Price:</b> {point.y}</div>
              </div>
            );
          }
          return null;
        }}
      />

      {/* Scatter points */}
      <Scatter
        name="Data"
        data={formattedData}
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

      {/* Vertical reference line at selected vintage */}
      {highlightVintage && (
        <ReferenceLine
          x={Number(highlightVintage)}
          stroke="blue"
          strokeDasharray="3 3"
        />
      )}
    </LineChart>
  );
}
