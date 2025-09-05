import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function BestValueTop10({ rows, selectedProduct, selectedVintage }) {
  if (!rows || rows.length === 0) return null;

  // Find the selected row
  const selectedRow = rows.find(
    (r) => r.Product === selectedProduct && String(r.Vintage) === String(selectedVintage)
  );
  if (!selectedRow) return <p>No matching wine found.</p>;

  // Get region + class of selected wine
  const { Region, Wine_Class } = selectedRow;

  // Filter same region + class
  const sameGroup = rows.filter(
    (r) => r.Region === Region && r.Wine_Class === Wine_Class
  );

  // Sort by PriceValueDiff ascending (negative = best value)
  const sorted = sameGroup
    .filter((r) => r.PriceValueDiff !== undefined && r.PriceValueDiff !== null)
    .sort((a, b) => a.PriceValueDiff - b.PriceValueDiff);

  const top10 = sorted.slice(0, 10);

  function toNum(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }

  function barColor(start, finish) {
    const now = new Date().getFullYear();
    if (!start || !finish) return "#cccccc"; // grey if missing
    if (now < start) return "#d9534f";       // red: not ready
    if (now > finish) return "#f0ad4e";      // yellow: past peak
    return "#5cb85c";                        // green: ready
  }

  return (
    <div style={{ display: "flex", gap: "20px", marginTop: "40px" }}>
      {/* LEFT: Table */}
      <div style={{ flex: 1 }}>
        <h3>Top 10 Best Value Wines</h3>
        <table border="1" cellPadding="6" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th>Region</th>
              <th>Product</th>
              <th>Vintage</th>
              <th>Price</th>
              <th>PriceValueDiff</th>
              <th>Bid_Qty</th>
              <th>Bid_Per_Case</th>
              <th>Spread</th>
              <th>Offer_Per_Case</th>
              <th>Offer_Qty</th>
            </tr>
          </thead>
          <tbody>
            {top10.map((r, idx) => (
              <tr key={idx}>
                <td>{r.Region}</td>
                <td>{r.Product}</td>
                <td>{r.Vintage}</td>
                <td>{r.Price}</td>
                <td>{r.PriceValueDiff}</td>
                <td>{r.Bid_Qty}</td>
                <td>{r.Bid_Per_Case}</td>
                <td>{r.Spread}</td>
                <td>{r.Offer_Per_Case}</td>
                <td>{r.Offer_Qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RIGHT: Drinking Window Chart */}
      <div style={{ flex: 1, minWidth: 500, height: 420 }}>
        <h3>Drinking Window (Top 10)</h3>
        <ResponsiveContainer width="100%" height={380}>
          <BarChart
            layout="vertical"
            data={top10.map((r) => ({
              label: `${r.Product} (${r.Vintage})`,
              start: toNum(r.DA_Start ?? r.DAStart),
              finish: toNum(r.DA_Finish ?? r.DAFinish),
            }))}
            margin={{ top: 10, right: 20, left: 120, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={['dataMin - 2', 'dataMax + 2']} />
            <YAxis dataKey="label" type="category" width={150} />
            <Tooltip
              formatter={(val, name, { payload }) =>
                [`${payload.start ?? "?"} – ${payload.finish ?? "?"}`, "Drinking Window"]
              }
            />
            <Bar
              dataKey="finish"
              isAnimationActive={false}
              shape={(props) => {
                const { y, height, payload, xAxis } = props;
                const start = payload.start;
                const finish = payload.finish;
                if (!start || !finish) return null;
                const x0 = xAxis.scale(start);
                const x1 = xAxis.scale(finish);
                return (
                  <rect
                    x={x0}
                    y={y}
                    width={x1 - x0}
                    height={height}
                    fill={barColor(start, finish)}
                  />
                );
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}