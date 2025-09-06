import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LabelList,
  Cell,
} from "recharts";

export default function BestValueTop10({ rows, selectedProduct, selectedVintage }) {
  if (!rows || rows.length === 0) return <p>No data available</p>;

  // Find the Region + Wine_Class of the selected product/vintage
  const selectedRow = rows.find(
    (r) => r.Product === selectedProduct && r.Vintage === selectedVintage
  );
  if (!selectedRow)
    return <p>No matching data for {selectedProduct} {selectedVintage}</p>;

  const { Region, Wine_Class } = selectedRow;

  // Filter wines from the same Region + Wine_Class
  const sameGroup = rows.filter(
    (r) => r.Region === Region && r.Wine_Class === Wine_Class
  );

  // Sort by PriceValueDiff (most negative = best value)
  const sorted = [...sameGroup].sort((a, b) => a.PriceValueDiff - b.PriceValueDiff);

  // Pick top 10 and add label for Y-axis
  const top10 = sorted.slice(0, 10).map((r) => ({
    ...r,
    Label: `${r.Product} (${r.Vintage})`,
  }));

  // Function to decide bar colour based on DA window
  const getBarColor = (row) => {
    if (!row.DA_Start || !row.DA_Finish) return "#8884d8"; // fallback purple
    if (row.Vintage < row.DA_Start) return "red"; // too young
    if (row.Vintage > row.DA_Finish) return "yellow"; // past prime
    return "green"; // drinking window
  };

  return (
    <div style={{ display: "flex", gap: "40px", alignItems: "flex-start" }}>
      {/* Table */}
      <table border="1" cellPadding="6">
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
          {top10.map((r, i) => (
            <tr key={i}>
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

      {/* Chart: Drinking Age Window */}
      <div>
        <BarChart
          width={500}
          height={300}
          data={top10}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 150, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={["dataMin - 1", "dataMax + 1"]} />
          <YAxis
            type="category"
            dataKey="Label"
            tick={{ fontSize: 12 }}
            interval={0}
          />
          <Tooltip />
          <Bar dataKey="Vintage" isAnimationActive={false}>
            <LabelList dataKey="Vintage" position="right" />
            {top10.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry)} />
            ))}
          </Bar>
        </BarChart>

        {/* Legend */}
        <div style={{ marginTop: "10px", display: "flex", gap: "20px" }}>
          <span style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: "15px", height: "15px", background: "red", marginRight: "6px" }}></div>
            Too young (before DA_Start)
          </span>
          <span style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: "15px", height: "15px", background: "green", marginRight: "6px" }}></div>
            Drinking window
          </span>
          <span style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: "15px", height: "15px", background: "yellow", marginRight: "6px" }}></div>
            Past prime (after DA_Finish)
          </span>
        </div>
      </div>
    </div>
  );
}
