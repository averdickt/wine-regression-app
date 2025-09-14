import React from "react";
import {
  ResponsiveContainer,
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
  colorMap,
}) {
  if (!data || data.length === 0) return null;

  const colors = colorMap || {
    red: "#D32F2F",
    green: "#4CAF50",
    yellow: "#FFC107",
  };

  const currentYear = new Date().getFullYear();

  // Calculate min/max vintages from this product’s data
  const vintages = data.map((d) => Number(d.Vintage)).filter((v) => !isNaN(v));
  const minVintage = Math.min(...vintages);
  const maxVintage = Math.max(...vintages);

  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <ComposedChart
          data={data}
          margin={{ top: 8, right: 20, left: 20, bottom: 8 }}
        >
          <CartesianGrid />

          {/* X-axis explicitly bounded to product’s vintage range */}
          <XAxis
            dataKey="Vintage"
            type="number"
            domain={[minVintage, maxVintage]}
            tickFormatter={(tick) => String(tick)}
          />

          <YAxis
            yAxisId="left"
            label={{ value: "Price", angle: -90, position: "insideLeft" }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={["dataMin - 1", 100]}
            label={{ value: "Score", angle: 90, position: "insideRight" }}
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
            isAnimationActive={false}
            shape={(props) => {
              const { x, y, width, height, payload } = props;
              if (!payload) return null;

              const start = Number(payload.DA_Start);
              const finish = Number(payload.DA_Finish);
              let color = "grey";

              if (!isNaN(start) && !isNaN(finish)) {
                if (currentYear > finish) color = colors.red;
                else if (currentYear < start) color = colors.yellow;
                else color = colors.green;
              }

              const isHighlight =
                highlightVintage &&
                String(payload.Vintage) === String(highlightVintage);

              return (
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill={color}
                  stroke={isHighlight ? "#000" : "none"}
                  strokeWidth={isHighlight ? 2 : 0}
                />
              );
            }}
          />

          <Scatter
            yAxisId="right"
            dataKey="Score"
            fill="#000"
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
                  r={isHighlight ? 7 : 4}
                  fill={isHighlight ? colors.red : "#000"}
                />
              );
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}