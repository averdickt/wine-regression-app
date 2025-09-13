import React, { useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceArea,
  Scatter,
} from "recharts";

export default function PriceScoreVintageChart({ data }) {
  const [colorBlindMode, setColorBlindMode] = useState(false);

  if (!data || data.length === 0) {
    return <p>No data available</p>;
  }

  // Normal color scheme
  const normalColors = {
    red: "#D32F2F",
    yellow: "#FFC107",
    green: "#4CAF50",
  };

  // Color-blind friendly scheme
  const colorBlindColors = {
    red: "#7B1FA2", // purple
    yellow: "#FFC107",
    green: "#2196F3", // blue
  };

  const colors = colorBlindMode ? colorBlindColors : normalColors;

  const currentYear = new Date().getFullYear();
  const minYear = Math.min(...data.map((d) => d.Vintage)) - 3;
  const maxYear = Math.max(...data.map((d) => d.Vintage)) + 3;

  return (
    <div style={{ width: "100%", height: 500 }}>
      {/* Toggle Button */}
      <button
        onClick={() => setColorBlindMode(!colorBlindMode)}
        style={{ marginBottom: "10px" }}
      >
        Toggle Color Blind Mode
      </button>

      <ResponsiveContainer>
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <XAxis
            type="number"
            dataKey="Vintage"
            domain={[minYear, maxYear]}
            tickFormatter={(tick) => tick.toString()}
          />
          <YAxis dataKey="Product" type="category" width={150} />
          <Tooltip />

          {/* Bars for drinking windows */}
          {data.map((wine, index) => {
            const { DA_Start, DA_Finish, Product } = wine;

            let color;
            if (currentYear < DA_Start) {
              color = colors.red; // too young
            } else if (currentYear > DA_Finish) {
              color = colors.yellow; // past peak
            } else {
              color = colors.green; // optimal
            }

            return (
              <ReferenceArea
                key={index}
                x1={DA_Start}
                x2={DA_Finish}
                y1={Product}
                y2={Product}
                stroke={color}
                fill={color}
                fillOpacity={0.6}
              />
            );
          })}

          {/* Scatter overlay for scores */}
          <Scatter data={data} dataKey="Score" fill="#000" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}