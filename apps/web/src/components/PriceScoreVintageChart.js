import React from "react";
import {
  ComposedChart,
  Bar,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";

export default function PriceScoreVintageChart({
  data,
  highlightVintage,
  DA_Start,
  DA_Finish,
}) {
  if (!data || data.length === 0) return null;

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
      <Tooltip />

      {/* Price bars with DA logic only */}
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
          return (
            <rect
              x={x}
              y={y}
              width={width}
              height={height}
              fill={color}
            />
          );
        }}
      />

      {/* Score scatter */}
      <Scatter
        yAxisId="right"
        dataKey="Score"
        fill="black"
        shape={(props) => {
          const { cx, cy, payload } = props;
          const isHighlighted =
            highlightVintage &&
            String(payload.Vintage) === String(highlightVintage);

          return (
            <circle
              cx={cx}
              cy={cy}
              r={isHighlighted ? 8 : 4}
              fill={isHighlighted ? "red" : "black"}
            />
          );
        }}
      />

      {/* Vertical line for highlighted vintage */}
      {highlightVintage && (
        <ReferenceLine
          x={Number(highlightVintage)}
          stroke="blue"
          strokeDasharray="3 3"
        />
      )}
    </ComposedChart>
  );
}