// apps/web/src/components/ProductRegressionChart.js
import { useMemo } from "react";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Line
} from "recharts";
import { calculateRegression } from "../../lib/regression";

export default function ProductRegressionChart({ data, product }) {
  // Filter data for selected product
  const filtered = useMemo(() => data.filter(d => d.Product === product), [data, product]);

  // Regression line
  const regressionLine = useMemo(() => {
    const points = filtered.map(d => ({ x: d.Score, y: d.Price }));
    return calculateRegression(points);
  }, [filtered]);

  return (
    <ScatterChart width={600} height={400}>
      <CartesianGrid />
      <XAxis dataKey="Score" name="Score" />
      <YAxis dataKey="Price" name="Price" />
      <Tooltip cursor={{ strokeDasharray: '3 3' }} />

      <Scatter data={filtered} fill="#8884d8" />
      <Line
        type="monotone"
        dataKey="y"
        data={regressionLine}
        stroke="#ff7300"
        dot={false}
      />
    </ScatterChart>
  );
}
