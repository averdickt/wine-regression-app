import React from "react";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";

export default function BestValueTop10Graph({ wines, colorMap }) {
  if (!wines || wines.length === 0) return <p>No data available</p>;

  // Find overall X-axis bounds
  const minVintage = Math.min(...wines.map((w) => w.DA_Start || w.Vintage));
  const maxVintage = Math.max(...wines.map((w) => w.DA_Finish || w.Vintage));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart
        layout="vertical"
        data={wines}
        margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" domain={[minVintage, maxVintage]} />
        <YAxis dataKey="Product" type="category" width={200} />
        <Tooltip />

        {wines.map((wine, index) => (
          <g key={index}>
            {/* Before DA_Start = red */}
            <ReferenceArea
              x1={minVintage}
              x2={wine.DA_Start}
              y1={index - 0.4}
              y2={index + 0.4}
              fill={colorMap.red}
              fillOpacity={0.4}
            />
            {/* Drinking window = green */}
            <ReferenceArea
              x1={wine.DA_Start}
              x2={wine.DA_Finish}
              y1={index - 0.4}
              y2={index + 0.4}
              fill={colorMap.green}
              fillOpacity={0.4}
            />
            {/* After DA_Finish = yellow */}
            <ReferenceArea
              x1={wine.DA_Finish}
              x2={maxVintage}
              y1={index - 0.4}
              y2={index + 0.4}
              fill={colorMap.yellow}
              fillOpacity={0.4}
            />
          </g>
        ))}

        {/* Bar overlay for PriceValueDiff */}
        <Bar dataKey="PriceValueDiff" barSize={20} fill="#8884d8" />
      </ComposedChart>
    </ResponsiveContainer>
  );
}