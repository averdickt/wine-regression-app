// apps/web/src/components/PriceScoreVintageChart.js
import {
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";

export default function PriceScoreVintageChart({ data, product }) {
  const filtered = data.filter(d => d.Product === product);

  return (
    <ComposedChart width={600} height={400} data={filtered}>
      <CartesianGrid stroke="#f5f5f5" />
      <XAxis dataKey="Vintage" />
      <YAxis yAxisId="left" label={{ value: "Price", angle: -90, position: "insideLeft" }} />
      <YAxis yAxisId="right" orientation="right" label={{ value: "Score", angle: -90, position: "insideRight" }} />
      <Tooltip />
      <Legend />

      {/* Price as bar */}
      <Bar yAxisId="left" dataKey="Price" barSize={20} fill="#413ea0" />

      {/* Score as line */}
      <Line yAxisId="right" type="monotone" dataKey="Score" stroke="#ff7300" />
    </ComposedChart>
  );
}
