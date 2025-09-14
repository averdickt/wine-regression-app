import React from "react";
import {
  ComposedChart,
  Bar,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function PriceScoreVintageChart({
  data,
  highlightVintage,
  DA_Start,
  DA_Finish,
}) {
  if (!data || data.length === 0) return null;

  const hasDA = typeof DA_Start === "number" && typeof DA_Finish === "number";

  return (
    <ComposedChart width={600} height={400} data={data}>
      <CartesianGrid />
      <XAxis dataKey="Vintage" />
      <YAxis
        yAxisId="left"
        label={{ value: "Price", angle: -90 }}
      />
      <YAxis
        yAxisId="right"
        orientation="right"
        domain={["dataMin - 1", 100]}
        label={{ value: "Score", angle: 90 }}
      />
      <Tooltip
        formatter={(value, key) => {
          if (key === "Price") return [`$${value}`, "Price"];
          if (key === "Score") return [value, "Score"];
          return value;
        }}
        labelFormatter={(label) => `Vintage: ${label}`}
      />

      <Bar
        yAxisId="left"
        dataKey="Price"
        shape={(props) => {
          const { x, y, width, height, payload } = props;
          if (!payload) return null;

          let color = "grey"; // fallback if no DA window
          if (hasDA) {
            if (payload.Vintage < DA_Start) color = "#D32F2F"; // pre-drinking
            else if (payload.Vintage > DA_Finish) color = "#FFC107"; // post-drinking
            else color = "green"; // drinking
          }

          // Highlight override
          if (
            highlightVintage &&
            String(payload.Vintage) === String(highlightVintage)
          ) {
            color = "blue";
          }

          return <rect x={x} y={y} width={width} height={height} fill={color} />;
        }}
      />

      <Scatter
        yAxisId="right"
        dataKey="Score"
        fill="black"
        shape={(props) => {
          const { cx, cy, payload } = props;
          if (!payload) return null;

          const isHighlight =
            highlightVintage &&
            String(payload.Vintage) === String(highlightVintage);

          return (
            <circle
              cx={cx}
              cy={cy}
              r={isHighlight ? 8 : 4}
              fill={isHighlight ? "#D32F2F" : "black"}
            />
          );
        }}
      />
    </ComposedChart>
  );
}