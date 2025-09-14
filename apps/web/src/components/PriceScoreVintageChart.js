import React from "react";
import {
  ComposedChart, Bar, Scatter, XAxis, YAxis, CartesianGrid, Tooltip
} from "recharts";

export default function PriceScoreVintageChart({ data, highlightVintage, DA_Start, DA_Finish }) {
  if (!data || data.length === 0) return null;

  return (
    <ComposedChart width={600} height={400} data={data}>
      <CartesianGrid />
      <XAxis dataKey="Vintage" />
      <YAxis yAxisId="left" label={{ value: "Price", angle: -90 }} />
      <YAxis yAxisId="right" orientation="right" label={{ value: "Score", angle: 90 }} />
      <Tooltip />

      <Bar
        yAxisId="left"
        dataKey="Price"
        fill="#8884d8"
        shape={(props) => {
          const { x, y, width, height, payload } = props;
          let color = "grey";
          if (payload.Vintage < DA_Start) color = "red";
          else if (payload.Vintage > DA_Finish) color = "yellow";
          else color = "green";

          if (highlightVintage && payload.Vintage === highlightVintage) {
            color = "blue"; // highlight override
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
          return (
            <circle
              cx={cx}
              cy={cy}
              r={highlightVintage && payload.Vintage === highlightVintage ? 8 : 4}
              fill={highlightVintage && payload.Vintage === highlightVintage ? "red" : "black"}
            />
          );
        }}
      />
    </ComposedChart>
  );
}
