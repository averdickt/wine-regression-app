import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceArea,
  Scatter,
} from "recharts";

export default function PriceScoreVintageChart({ data, colorMap }) {
  if (!data || data.length === 0) {
    return <p>No data available</p>;
  }

  const minYear = Math.min(...data.map((d) => d.vintage)) - 3;
  const maxYear = Math.max(...data.map((d) => d.vintage)) + 3;

  return (
    <div style={{ width: "100%", height: 500 }}>
      <ResponsiveContainer>
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <XAxis
            type="number"
            dataKey="vintage"
            domain={[minYear, maxYear]}
            tickFormatter={(tick) => tick.toString()}
          />
          <YAxis dataKey="Product" type="category" width={150} />
          <Tooltip />

          {data.map((wine, index) => {
            const { DA_Start, DA_Finish, Product } = wine;

            // pick colors based on drinking window
            let color = colorMap.green;
            if (new Date().getFullYear() < DA_Start) {
              color = colorMap.yellow;
            } else if (new Date().getFullYear() > DA_Finish) {
              color = colorMap.red;
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

          <Scatter data={data} dataKey="score" fill="#000" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}