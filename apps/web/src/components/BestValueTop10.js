// src/components/BestValueTop10.js
import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  LabelList,
  Cell,
} from "recharts";

export default function BestValueTop10({ rows, selectedProduct, selectedVintage }) {
  // --- find the score of selected wine ---
  const selectedRow = rows.find(
    (r) => r.Product === selectedProduct && r.Vintage === selectedVintage
  );
  const selectedScore = selectedRow?.Score;

  // --- filter same region & wine_class ---
  const region = selectedRow?.Region;
  const wineClass = selectedRow?.Wine_Class;

  const top10 = useMemo(() => {
    if (!selectedScore || !region || !wineClass) return [];

    return rows
      .filter((r) => r.Region === region && r.Wine_Class === wineClass)
      .map((r) => ({
        ...r,
        Label: `${r.Product} (${r.Vintage})`,
      }))
      .sort((a, b) => a.PriceValueDiff - b.PriceValueDiff)
      .slice(0, 10);
  }, [rows, selectedScore, region, wineClass]);

  if (!selectedScore) {
    return <p>Please select a Product and Vintage with a score.</p>;
  }
  if (top10.length === 0) {
    return <p>No matching wines found for region/class.</p>;
  }

  // --- determine x-axis range ---
  const minStart = Math.min(...top10.map((r) => r.DA_Start || r.Vintage)) - 3;
  const maxFinish = Math.max(...top10.map((r) => r.DA_Finish || r.Vintage)) + 3;

  // --- colour bars by drinking window ---
  const getBarColor = (r) => {
    if (r.Vintage < r.DA_Start) return "red";
    if (r.Vintage > r.DA_Finish) return "yellow";
    return "green";
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Top 10 Best Value Wines (Same Region & Class)</h2>

      {/* --- Table --- */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
        }}
      >
        <thead>
          <tr>
            {[
              "Region",
              "Product",
              "Vintage",
              "Price",
              "PriceValueDiff",
              "Bid_Qty",
              "Bid_Per_Case",
              "Spread",
              "Offer_Per_Case",
              "Offer_Qty",
            ].map((h) => (
              <th
                key={h}
                style={{
                  border: "1px solid #ccc",
                  padding: "6px",
                  background: "#f9f9f9",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {top10.map((r, i) => (
            <tr key={i}>
              <td style={{ border: "1px solid #ccc", padding: "6px" }}>{r.Region}</td>
              <td style={{ border: "1px solid #ccc", padding: "6px" }}>{r.Product}</td>
              <td style={{ border: "1px solid #ccc", padding: "6px" }}>{r.Vintage}</td>
              <td style={{ border: "1px solid #ccc", padding: "6px" }}>{r.Price}</td>
              <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                {r.PriceValueDiff}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "6px" }}>{r.Bid_Qty}</td>
              <td style={{ border: "1px solid #ccc", padding: "6px" }}>{r.Bid_Per_Case}</td>
              <td style={{ border: "1px solid #ccc", padding: "6px" }}>{r.Spread}</td>
              <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                {r.Offer_Per_Case}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "6px" }}>{r.Offer_Qty}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- Graph --- */}
      <div style={{ width: "100%", height: 500 }}>
        <ResponsiveContainer>
          <ComposedChart
            layout="vertical"
            data={top10}
            margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
          >
            <XAxis
              type="number"
              domain={[minStart, maxFinish]}
              label={{ value: "Vintage / Years", position: "insideBottom", offset: -5 }}
            />
            <YAxis dataKey="Label" type="category" width={200} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="Vintage" barSize={20}>
              {top10.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry)} />
              ))}
              <LabelList dataKey="Vintage" position="insideRight" />
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
