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
  const startYear = highlightRow?.DA_Start || highlightVintage;
  const endYear = highlightRow?.DA_Finish || highlightVintage;

  // Chart domains
  const minVintage = Math.min(...data.map((d) => d.Vintage));
  const maxVintage = Math.max(...data.map((d) => d.Vintage));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart>
        <CartesianGrid />
        <XAxis type="number" dataKey="Vintage" domain={[minVintage, maxVintage]} />
        <YAxis type="number" dataKey="Price" />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />

        {/* Background ranges */}
        {highlightRow && (
          <>
            {/* Before DA_Start = red */}
            <ReferenceArea
              x1={minVintage}
              x2={startYear}
              y1={0}
              y2="100%"
              fill={colorMap.red}
              fillOpacity={0.2}
            />
            {/* Between start and finish = green */}
            <ReferenceArea
              x1={startYear}
              x2={endYear}
              y1={0}
              y2="100%"
              fill={colorMap.green}
              fillOpacity={0.2}
            />
            {/* After DA_Finish = yellow */}
            <ReferenceArea
              x1={endYear}
              x2={maxVintage}
              y1={0}
              y2="100%"
              fill={colorMap.yellow}
              fillOpacity={0.2}
            />
          </>
        )}

        {/* All data points */}
        <Scatter
          name="Wines"
          data={data}
          fill="#8884d8"
        />

        {/* Highlighted vintage */}
        {highlightRow && (
          <Scatter
            name="Selected Vintage"
            data={[highlightRow]}
            fill="#FF0000"
          />
        )}
      </ScatterChart>
    </ResponsiveContainer>
  );
}