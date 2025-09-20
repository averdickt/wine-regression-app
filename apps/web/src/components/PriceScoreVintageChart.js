import React, { useMemo } from "react";
import {
  ComposedChart,
  Bar,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

/**
 * Props:
 * - data: array of rows (for a single product)
 * - highlightVintage: (number|string) vintage to highlight
 * - colorMap: { red, green, yellow } - colors provided by index.js
 */
export default function PriceScoreVintageChart({
  data,
  highlightVintage,
  colorMap = { red: "#D32F2F", green: "#4CAF50", yellow: "#FFC107" },
}) {
  if (!data || data.length === 0) return null;

  const now = new Date().getFullYear();

  // Make sure vintages are numbers when possible and build chartData
  const chartData = useMemo(
    () =>
      data
        .map((r) => ({
          ...r,
          Vintage: r.Vintage === "" || r.Vintage == null ? "" : Number(r.Vintage),
          Price: Number(r.Price) || 0,
          Score: Number(r.Score) || 0,
          DA_Start: Number(r.DA_Start) || 0,
          DA_Finish: Number(r.DA_Finish) || 0,
        }))
        .sort((a, b) => {
          if (a.Vintage === "" || b.Vintage === "") return 0;
          return a.Vintage - b.Vintage;
        }),
    [data]
  );

  // Only show vintages present (no gaps) as category ticks
  const vintageTicks = Array.from(new Set(chartData.map((d) => d.Vintage))).filter(
    (v) => v !== "" && !Number.isNaN(v)
  );

  const getBarColor = (row) => {
    // Color logic based on current year vs this row's drinking window
    if (now < row.DA_Start) {
      // not yet drinkable
      return colorMap.yellow;
    } else if (now > row.DA_Finish) {
      // past drinking window
      return colorMap.red;
    }
    // within drinking window
    return colorMap.green;
  };

  // Selected (detail) row
  const selectedRow = chartData.find((r) => String(r.Vintage) === String(highlightVintage));

  return (
    <div>
      <ResponsiveContainer width="100%" height={360}>
        <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="Vintage"
            type="category"
            ticks={vintageTicks}
            interval={0}
            tick={{ angle: -45, textAnchor: "end", fontSize: 12 }}
            height={60}
            label={{ value: "Vintage", position: "bottom", offset: 50 }}
          />
          <YAxis yAxisId="left" label={{ value: "Price", angle: -90, position: "insideLeft" }} />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={["dataMin - 1", 100]}
            label={{ value: "Score", angle: 90, position: "insideRight" }}
          />
          <Tooltip
            formatter={(value, name, props) => {
              if (name === "Price") return [`$${Number(value).toFixed(2)}`, "Price"];
              if (name === "Score") return [value, "Score"];
              return [value, name];
            }}
            labelFormatter={(label) => `Vintage: ${label}`}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                // payload[0] may be Price entry; combine info from payload[0].payload
                const p = payload[0].payload;
                return (
                  <div style={{ background: "white", border: "1px solid #ccc", padding: 8 }}>
                    <div><strong>Product:</strong> {p.Product || "-"}</div>
                    <div><strong>Vintage:</strong> {p.Vintage}</div>
                    <div><strong>Price:</strong> ${Number(p.Price).toFixed(2)}</div>
                    <div><strong>Score:</strong> {p.Score}</div>
                    <div><strong>Drinking Window:</strong> {p.DA_Start} - {p.DA_Finish}</div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 10 }} />
          {/* Price bars */}
          <Bar yAxisId="left" dataKey="Price" name="Price">
            {chartData.map((entry, idx) => {
              const isHighlighted = String(entry.Vintage) === String(highlightVintage);
              // If highlighted, use a distinct stroke color and slightly darker fill
              const base = getBarColor(entry);
              const fill = isHighlighted ? "#1976D2" : base; // blue for highlight
              return <Cell key={`cell-${idx}`} fill={fill} />;
            })}
          </Bar>

          {/* Score scatter - plotted against same X (category) */}
          <Scatter
            yAxisId="right"
            name="Score"
            data={chartData}
            dataKey="Score"
            legendType="circle"
            shape={(props) => {
              const { cx, cy, payload } = props;
              const isHighlighted = String(payload.Vintage) === String(highlightVintage);
              const r = isHighlighted ? 7 : 4;
              const fill = isHighlighted ? "#D32F2F" : "#000"; // highlight score red, else black
              return <circle cx={cx} cy={cy} r={r} fill={fill} />;
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* --- Small details panel for selected vintage --- */}
      <div style={{ marginTop: 12, border: "1px solid #eee", padding: 10, borderRadius: 6 }}>
        <strong>Selected vintage details</strong>
        {selectedRow ? (
          <table style={{ width: "100%", marginTop: 8, fontSize: 14 }}>
            <tbody>
              <tr>
                <td><strong>Product</strong></td>
                <td>{selectedRow.Product}</td>
              </tr>
              <tr>
                <td><strong>Vintage</strong></td>
                <td>{selectedRow.Vintage}</td>
              </tr>
              <tr>
                <td><strong>Bid Qty</strong></td>
                <td>{selectedRow.Bid_Qty ?? "-"}</td>
              </tr>
              <tr>
                <td><strong>Bid / bottle</strong></td>
                <td>{selectedRow.Bid_Per_Case ? `$${(selectedRow.Bid_Per_Case / (parseInt(selectedRow.Case_Format || "12 x 75cl", 10) || 12)).toFixed(2)}` : "-"}</td>
              </tr>
              <tr>
                <td><strong>Offer Qty</strong></td>
                <td>{selectedRow.Offer_Qty ?? "-"}</td>
              </tr>
              <tr>
                <td><strong>Offer / bottle</strong></td>
                <td>{selectedRow.Offer_Per_Case ? `$${(selectedRow.Offer_Per_Case / (parseInt(selectedRow.Case_Format || "12 x 75cl", 10) || 12)).toFixed(2)}` : "-"}</td>
              </tr>
              <tr>
                <td><strong>Spread (%)</strong></td>
                <td>{typeof selectedRow.Spread === "number" ? `${(selectedRow.Spread * 100).toFixed(2)}%` : (selectedRow.Spread ?? "-")}</td>
              </tr>
              <tr>
                <td><strong>Drinking window</strong></td>
                <td>{selectedRow.DA_Start} - {selectedRow.DA_Finish}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <div style={{ marginTop: 8 }}>No vintage selected (or selected vintage not available in this product).</div>
        )}
      </div>
    </div>
  );
}