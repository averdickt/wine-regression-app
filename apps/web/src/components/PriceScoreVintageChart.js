// apps/web/src/components/PriceScoreVintageChart.js
import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  Legend,
} from "recharts";

export default function PriceScoreVintageChart({
  data,
  highlightVintage,
  colorMap = { red: "#D32F2F", green: "#4CAF50", yellow: "#FFC107" },
  onPointClick, // <--- new
}) {
  if (!data || data.length === 0) return null;

  const now = new Date().getFullYear();

  // build chartData and ensure Vintage numeric
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

  const vintageTicks = Array.from(new Set(chartData.map((d) => d.Vintage))).filter(
    (v) => v !== "" && !Number.isNaN(v)
  );

  const getBarColor = (row) => {
    if (now < row.DA_Start) return colorMap.yellow;
    if (now > row.DA_Finish) return colorMap.red;
    return colorMap.green;
  };

  const selectedRow = chartData.find((r) => String(r.Vintage) === String(highlightVintage));

  return (
    <div style={{ width: "100%" }}>
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
          <YAxis yAxisId="right" orientation="right" domain={["dataMin - 1", 100]} label={{ value: "Score", angle: 90, position: "insideRight" }} />

          <Tooltip
            formatter={(value, name) => {
              if (name === "Price") return [`$${Number(value).toFixed(2)}`, "Price"];
              if (name === "Score") return [value, "Score"];
              return [value, name];
            }}
            labelFormatter={(label, payload) => {
              if (payload && payload.length > 0 && payload[0].payload) {
                const p = payload[0].payload;
                return `Vintage: ${label}  (Drinking: ${p.DA_Start}-${p.DA_Finish})`;
              }
              return `Vintage: ${label}`;
            }}
          />

          <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 10 }} />

          {/* Price bars -> use Cell per entry so we can attach onClick */}
          <Bar yAxisId="left" dataKey="Price" name="Price" isAnimationActive={false}>
            {chartData.map((entry, idx) => {
              const isHighlighted = String(entry.Vintage) === String(highlightVintage);
              const base = getBarColor(entry);
              const fill = isHighlighted ? "#1976D2" : base; // highlighted blue
              return (
                <Cell
                  key={`cell-${idx}`}
                  fill={fill}
                  cursor={onPointClick ? "pointer" : "default"}
                  onClick={() => {
                    if (!onPointClick) return;
                    onPointClick({ product: entry.Product, vintage: entry.Vintage });
                  }}
                />
              );
            })}
          </Bar>

          {/* Score scatter with clickable points */}
          <Scatter
            yAxisId="right"
            name="Score"
            data={chartData}
            dataKey="Score"
            shape={(props) => {
              const { cx, cy, payload } = props;
              if (cx == null || cy == null) return null;
              const isHighlighted = String(payload.Vintage) === String(highlightVintage);
              const r = isHighlighted ? 7 : 4;
              const fill = isHighlighted ? colorMap.red : "#000";
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill={fill}
                  style={{ cursor: onPointClick ? "pointer" : "default" }}
                  onClick={() => {
                    if (!onPointClick) return;
                    onPointClick({ product: payload.Product, vintage: payload.Vintage });
                  }}
                />
              );
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* small details panel (unchanged) */}
      <div style={{ marginTop: 12, border: "1px solid #eee", padding: 10, borderRadius: 6 }}>
        <strong>Selected vintage details</strong>
        {selectedRow ? (
          <table style={{ width: "100%", marginTop: 8, fontSize: 14 }}>
            <tbody>
              <tr><td><strong>Product</strong></td><td>{selectedRow.Product}</td></tr>
              <tr><td><strong>Vintage</strong></td><td>{selectedRow.Vintage}</td></tr>
              <tr><td><strong>Bid Qty</strong></td><td>{selectedRow.Bid_Qty ?? "-"}</td></tr>
              <tr><td><strong>Offer Qty</strong></td><td>{selectedRow.Offer_Qty ?? "-"}</td></tr>
              <tr><td><strong>Spread (%)</strong></td><td>{typeof selectedRow.Spread === "number" ? `${selectedRow.Spread.toFixed(1)}%` : (selectedRow.Spread ?? "-")}</td></tr>
              <tr><td><strong>Drinking window</strong></td><td>{selectedRow.DA_Start} - {selectedRow.DA_Finish}</td></tr>
            </tbody>
          </table>
        ) : (
          <div style={{ marginTop: 8 }}>No vintage selected (or selected vintage not available in this product).</div>
        )}
      </div>
    </div>
  );
}