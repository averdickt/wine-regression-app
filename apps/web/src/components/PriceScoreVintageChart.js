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

  // default color map (falls back if index.js doesn't pass one)
  const colors = colorMap || {
    red: "#D32F2F",
    green: "#4CAF50",
    yellow: "#FFC107",
  };

  const currentYear = new Date().getFullYear();

  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 8, right: 20, left: 20, bottom: 8 }}>
          <CartesianGrid />
          <XAxis dataKey="Vintage" type="number" />
          <YAxis yAxisId="left" label={{ value: "Price", angle: -90, position: "insideLeft" }} />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={["dataMin - 1", 100]}
            label={{ value: "Score", angle: 90, position: "insideRight" }}
          />

          <Tooltip
            formatter={(value, key, props) => {
              if (!props || !props.payload) return "";
              if (key === "Price") return [`$${value}`, "Price"];
              if (key === "Score") return [value, "Score"];
              return value;
            }}
            labelFormatter={(label) => `Vintage: ${label}`}
          />

          {/* Price bars: color determined by each payload's DA_Start / DA_Finish vs currentYear */}
          <Bar
            yAxisId="left"
            dataKey="Price"
            isAnimationActive={false}
            shape={(props) => {
              const { x, y, width, height, payload } = props;
              if (!payload) return null;

              const start = Number(payload.DA_Start);
              const finish = Number(payload.DA_Finish);
              let color = "grey"; // fallback

              if (!isNaN(start) && !isNaN(finish)) {
                if (currentYear > finish) {
                  // past drinking window
                  color = colors.red;
                } else if (currentYear < start) {
                  // not yet ready
                  color = colors.yellow;
                } else {
                  // within drinking window
                  color = colors.green;
                }
              }

              // highlight override (selected vintage)
              if (highlightVintage && String(payload.Vintage) === String(highlightVintage)) {
                // make it distinct (black border + slightly different fill)
                return (
                  <g>
                    <rect x={x} y={y} width={width} height={height} fill={color} stroke="#000" strokeWidth={1.5} />
                  </g>
                );
              }

              return <rect x={x} y={y} width={width} height={height} fill={color} />;
            }}
          />

          {/* Score points (right axis) */}
          <Scatter
            yAxisId="right"
            dataKey="Score"
            fill="#000"
            shape={(props) => {
              const { cx, cy, payload } = props;
              if (!payload) return null;
              const isHighlight = highlightVintage && String(payload.Vintage) === String(highlightVintage);
              return <circle cx={cx} cy={cy} r={isHighlight ? 7 : 4} fill={isHighlight ? colors.red : "#000"} />;
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}