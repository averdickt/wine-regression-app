import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Bar
} from "recharts";

export default function BestValueTop10Graph({ wines }) {
  if (!wines || wines.length === 0) return <p>No graph data available</p>;

  // --- Compute min/max year range ---
  const minStart = Math.min(...wines.map((w) => w.DA_Start)) - 3;
  const maxFinish = Math.max(...wines.map((w) => w.DA_Finish)) + 3;

  // --- Generate an array of every year between minStart & maxFinish ---
  const ticks = [];
  for (let y = minStart; y <= maxFinish; y++) {
    ticks.push(y);
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart
        layout="vertical"
        data={wines}
        margin={{ top: 20, right: 30, left: 150, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        
        {/* Show every year tick and rotate labels */}
        <XAxis
          type="number"
          domain={[minStart, maxFinish]}
          ticks={ticks}
          tick={{ fontSize: 10, angle: -45, textAnchor: "end" }}
        />

        <YAxis
          dataKey={(w) => `${w.Product} ${w.Vintage}`}
          type="category"
          width={200}
          tick={{ fontSize: 12 }}
        />

        <Tooltip />

        {/* Yellow pre-drinking */}
        <Bar dataKey="pre" stackId="a" fill="yellow" />
        {/* Green drinking */}
        <Bar dataKey="drinking" stackId="a" fill="green" />
        {/* Red post-drinking */}
        <Bar dataKey="post" stackId="a" fill="red" />
      </ComposedChart>
    </ResponsiveContainer>
  );
}