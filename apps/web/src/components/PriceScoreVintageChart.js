import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";

export default function PriceScoreVintageChart({ data, highlightVintage, colorMap }) {
  if (!data || data.length === 0) return <p>No data available</p>;

  const highlightRow = data.find((r) => r.Vintage === highlightVintage);
  const minVintage = Math.min(...data.map((d) => d.Vintage));
  const maxVintage = Math.max(...data.map((d) => d.Vintage));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart>
        <CartesianGrid />
        <XAxis type="number" dataKey="Vintage" domain={[minVintage, maxVintage]} />
        <YAxis type="number" dataKey="Price" />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />

        {highlightRow && (
          <>
            <ReferenceArea
              x1={minVintage}
              x2={highlightRow.DA_Start}
              y1={0}
              y2="100%"
              fill={colorMap.red}
              fillOpacity={0.2}
            />
            <ReferenceArea
              x1={highlightRow.DA_Start}
              x2={highlightRow.DA_Finish}
              y1={0}
              y2="100%"
              fill={colorMap.green}
              fillOpacity={0.2}
            />
            <ReferenceArea
              x1={highlightRow.DA_Finish}
              x2={maxVintage}
              y1={0}
              y2="100%"
              fill={colorMap.yellow}
              fillOpacity={0.2}
            />
          </>
        )}

        <Scatter data={data} fill="#8884d8" />
        {highlightRow && <Scatter data={[highlightRow]} fill="#FF0000" />}
      </ScatterChart>
    </ResponsiveContainer>
  );
}
