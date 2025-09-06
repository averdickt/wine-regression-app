import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

export default function BestValueTop10({ rows, selectedProduct, selectedVintage }) {
  if (!rows || rows.length === 0 || !selectedProduct || !selectedVintage) {
    return null;
  }

  // Normalize selected vintage to string for comparison
  const selectedVintageStr = String(selectedVintage);

  // Find the selected row
  const selectedRow = rows.find(
    r =>
      r.Product === selectedProduct &&
      String(r.Vintage) === selectedVintageStr
  );

  if (!selectedRow) {
    return <p>No matching data for {selectedProduct} {selectedVintage}</p>;
  }

  const { Region, Wine_Class } = selectedRow;

  // Get all wines in same region + class, sort by PriceValueDiff ascending
  const candidates = rows
    .filter(r => r.Region === Region && r.Wine_Class === Wine_Class)
    .map(r => ({ ...r, Vintage: String(r.Vintage) })) // normalize vintages
    .sort((a, b) => a.PriceValueDiff - b.PriceValueDiff)
    .slice(0, 10);

  if (candidates.length === 0) {
    return <p>No comparable wines found.</p>;
  }

  // Color function for drinking window
  const getColor = (year, start, finish) => {
    if (!start || !finish) return "#ccc";
    if (year < start) return "red";
    if (year > finish) return "yellow";
    return "green";
  };

  return (
    <div>
      <h2>Top 10 Best Value Wines ({Region}, {Wine_Class})</h2>
      <div style={{ display: "flex", gap: "40px" }}>
        {/* Table */}
        <table border="1" cellPadding="5">
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
            {candidates.map((wine, idx) => (
              <tr key={idx}>
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

        {/* Chart */}
        <ResponsiveContainer width={400} height={300}>
          <BarChart
            data={candidates}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
          >
            <XAxis type="number" dataKey="Vintage" />
            <YAxis type="category" dataKey="Product" />
            <Tooltip />
            <Bar dataKey="Vintage">
              {candidates.map((wine, idx) => (
                <Cell
                  key={idx}
                  fill={getColor(
                    parseInt(wine.Vintage),
                    wine.DA_Start,
                    wine.DA_Finish
                  )}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
