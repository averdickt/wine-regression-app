// apps/web/src/components/ProductRegressionChart.js
import React from "react";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { bestFitRegression } from "../lib/Regression";

export default function ProductRegressionChart({
  data,
  highlightVintage,
  onPointClick, // callback from index.js
}) {
  if (!data || data.length === 0) return null;

  // keep original product in payload so click can set product too (even if same)
  const formattedData = data.map((d) => ({
    x: Number(d.Score),
    y: Number(d.Price),
    vintage: d.Vintage,
    product: d.Product ?? d.ProductName ?? "", // defensive
    raw: d,
  }));

  // regression
  const reg = bestFitRegression(formattedData.map((d) => [d.x, d.y]));

  // produce line points
  const xMin = Math.min(...formattedData.map((d) => d.x)) - 1;
  const xMax = 100;
  const step = (xMax - xMin) / 50;
  const linePoints = [];
  for (let x = xMin; x <= xMax; x += step) {
    const y = reg.predict(x)[1];
    linePoints.push({ x, y });
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
        <CartesianGrid />
        <XAxis
          type="number"
          dataKey="x"
          name="Score"
          domain={["dataMin - 1", 100]}
          tickCount={8}
        />
        <YAxis type="number" dataKey="y" name="Price" />

        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const p = payload[0].payload;
              return (
                <div style={{ background: "white", border: "1px solid #ccc", padding: 8 }}>
                  <div><strong>Product:</strong> {p.product}</div>
                  <div><strong>Vintage:</strong> {p.vintage}</div>
                  <div><strong>Score:</strong> {p.x}</div>
                  <div><strong>Price:</strong> ${p.y}</div>
                </div>
              );
            }
            return null;
          }}
        />

        {/* Scatter points: custom shape so we can attach onclick */}
        <Scatter
          name="Products"
          data={formattedData}
          fill="#8884d8"
          shape={(props) => {
            const { cx, cy, payload } = props;
            if (cx == null || cy == null) return null;
            const isHighlighted = highlightVintage && String(payload.vintage) === String(highlightVintage);
            const r = isHighlighted ? 8 : 5;
            const fill = isHighlighted ? "red" : "#8884d8";
            return (
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill={fill}
                stroke={isHighlighted ? "#000" : "none"}
                strokeWidth={isHighlighted ? 1.5 : 0}
                style={{ cursor: onPointClick ? "pointer" : "default" }}
                onClick={() => {
                  if (!onPointClick) return;
                  onPointClick({ product: payload.product, vintage: payload.vintage });
                }}
              />
            );
          }}
        />

        {/* Regression line as connected scatter */}
        <Scatter
          name="Regression"
          data={linePoints}
          line={{ stroke: "#ff7300", strokeWidth: 2 }}
          shape={() => null}
          isAnimationActive={false}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
}