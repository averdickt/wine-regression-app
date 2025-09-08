import React from "react";

export default function BestValueTable({ rows }) {
  if (!rows || rows.length === 0) {
    return <p>No data available for Best Value wines.</p>;
  }

  // Sort by PriceValueDiff (best value = lowest number)
  const sorted = [...rows].sort((a, b) => a.PriceValueDiff - b.PriceValueDiff);

  // Take top 10
  const top10 = sorted.slice(0, 10);

  return (
    <div>
      <h3>Top 10 Best Value Wines (by Price/Value Diff)</h3>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "10px",
        }}
      >
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
              Product
            </th>
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
              Vintage
            </th>
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "right" }}>
              Score
            </th>
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "right" }}>
              Price (£)
            </th>
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "right" }}>
              Value Diff
            </th>
          </tr>
        </thead>
        <tbody>
          {top10.map((wine, idx) => (
            <tr key={idx}>
              <td style={{ padding: "6px 4px" }}>{wine.Product}</td>
              <td style={{ padding: "6px 4px" }}>{wine.Vintage}</td>
              <td style={{ padding: "6px 4px", textAlign: "right" }}>
                {wine.Score}
              </td>
              <td style={{ padding: "6px 4px", textAlign: "right" }}>
                {wine.Price.toLocaleString()}
              </td>
              <td style={{ padding: "6px 4px", textAlign: "right" }}>
                {wine.PriceValueDiff.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}