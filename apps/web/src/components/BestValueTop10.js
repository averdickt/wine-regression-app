import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function BestValueTop10({ rows, selectedProduct, selectedVintage }) {
  if (!rows || rows.length === 0) return null;

  // find the selected wine’s region + class
  const selectedWine = rows.find(
    (r) => r.Product === selectedProduct && r.Vintage === selectedVintage
  );
  if (!selectedWine) return null;

  const { Region, Wine_Class } = selectedWine;

  // filter wines within same Region + Class
  const filtered = rows.filter(
    (r) => r.Region === Region && r.Wine_Class === Wine_Class
  );

  // sort by value (PriceValueDiff) and take top 10
  const top10 = filtered
    .sort((a, b) => a.PriceValueDiff - b.PriceValueDiff)
    .slice(0, 10);

  // prepare data for graph
  const chartData = top10.map((wine) => {
    let color = "green";
    if (wine.Vintage < wine.DA_Start) color = "red";
    else if (wine.Vintage > wine.DA_Finish) color = "yellow";

    return {
      name: `${wine.Product} ${wine.Vintage}`,
      vintage: wine.Vintage,
      DA_Start: wine.DA_Start,
      DA_Finish: wine.DA_Finish,
      color,
    };
  });

  return (
    <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
      {/* table */}
      <table border="1" cellPadding="5" style={{ borderCollapse: "collapse" }}>
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
          {top10.map((wine, i) => (
            <tr key={i}>
              <td>{wine.Region}</td>
              <td>{wine.Product}</td>
              <td>{wine.Vintage}</td>
              <td>{wine.Price}</td>
              <td>{wine.PriceValueDiff}</td>
              <td>{wine.Bid_Qty}</td>
              <td>{wine.Bid_Per_Case}</td>
              <td>{wine.Spread}</td>
              <td>{wine.Offer_Per_Case}</td>
              <td>{wine.Offer_Qty}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* graph */}
      <div style={{ flex: 1, height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="vintage" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="vintage"
              stroke="#8884d8"
              dot={({ cx, cy, payload }) => (
                <circle cx={cx} cy={cy} r={6} fill={payload.color} />
              )}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}