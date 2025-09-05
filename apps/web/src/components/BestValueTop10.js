import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function toNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function barColor(vintage, start, finish) {
  const v = toNum(vintage);
  const s = toNum(start);
  const f = toNum(finish);
  if (v == null || s == null || f == null) return "#cccccc"; // grey if no data
  if (v < s) return "#d9534f";   // red  (before window)
  if (v > f) return "#f0ad4e";   // yellow (past peak)
  return "#5cb85c";              // green (in window)
}

export default function BestValueTop10({ rows, selectedProduct, selectedVintage }) {
  const { top10, cohortInfo } = useMemo(() => {
    if (!rows?.length) return { top10: [], cohortInfo: null };

    // Find selected row
    const selectedRow =
      rows.find(
        r =>
          String(r.Product).toLowerCase() === String(selectedProduct).toLowerCase() &&
          (selectedVintage ? String(r.Vintage) === String(selectedVintage) : true)
      ) ||
      rows.find(r => String(r.Product).toLowerCase() === String(selectedProduct).toLowerCase());

    if (!selectedRow) return { top10: [], cohortInfo: null };

    const region = selectedRow.Region || "";
    const wineClass = selectedRow.Wine_Class || selectedRow.WineClass || "";

    // Cohort = same Region + Wine_Class
    const cohort = rows.filter(
      r =>
        String(r.Region || "") === String(region) &&
        String(r.Wine_Class || r.WineClass || "") === String(wineClass)
    );

    // Sort by PriceValueDiff ascending (most undervalued first)
    const ranked = cohort
      .filter(r => r.PriceValueDiff != null)
      .sort((a, b) => a.PriceValueDiff - b.PriceValueDiff)
      .slice(0, 10);

    return { top10: ranked, cohortInfo: { region, wineClass } };
  }, [rows, selectedProduct, selectedVintage]);

  if (!cohortInfo) return null;

  return (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-start", marginTop: 40 }}>
      {/* Table */}
      <div style={{ flex: 1, overflowX: "auto" }}>
        <h2>
          Best Value (Top 10) — Region: {cohortInfo.region || "N/A"} | Class:{" "}
          {cohortInfo.wineClass || "N/A"}
        </h2>

        {top10.length === 0 ? (
          <p>No qualifying rows.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
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
                ].map(h => (
                  <th
                    key={h}
                    style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: "8px" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {top10.map((r, idx) => (
                <tr key={idx}>
                  <td style={{ padding: "8px", borderBottom: "1px solid #f0f0f0" }}>{r.Region}</td>
                  <td style={{ padding: "8px", borderBottom: "1px solid #f0f0f0" }}>{r.Product}</td>
                  <td style={{ padding: "8px", borderBottom: "1px solid #f0f0f0" }}>{r.Vintage}</td>
                  <td style={{ padding: "8px", borderBottom: "1px solid #f0f0f0" }}>{r.Price}</td>
                  <td
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid #f0f0f0",
                      color: r.PriceValueDiff < 0 ? "#5cb85c" : "#d9534f",
                      fontWeight: 600,
                    }}
                  >
                    {Number(r.PriceValueDiff).toFixed(0)}
                  </td>
                  <td style={{ padding: "8px", borderBottom: "1px solid #f0f0f0" }}>{r.Bid_Qty ?? ""}</td>
                  <td style={{ padding: "8px", borderBottom: "1px solid #f0f0f0" }}>{r.Bid_Per_Case ?? ""}</td>
                  <td style={{ padding: "8px", borderBottom: "1px solid #f0f0f0" }}>{r.Spread ?? ""}</td>
                  <td style={{ padding: "8px", borderBottom: "1px solid #f0f0f0" }}>{r.Offer_Per_Case ?? ""}</td>
                  <td style={{ padding: "8px", borderBottom: "1px solid #f0f0f0" }}>{r.Offer_Qty ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Chart */}
      <div style={{ flex: 1, minWidth: 340, height: 420 }}>
        <h3>Drinking Window (Top 10)</h3>
        <ResponsiveContainer width="100%" height={380}>
          <BarChart
            data={top10.map(r => ({
              label: `${r.Product} (${r.Vintage})`,
              Vintage: toNum(r.Vintage),
              Price: toNum(r.Price),
              DA_Start: r.DA_Start ?? r.DAStart ?? null,
              DA_Finish: r.DA_Finish ?? r.DAFinish ?? null,
            }))}
            margin={{ top: 10, right: 10, left: 0, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" angle={-35} textAnchor="end" interval={0} height={80} />
            <YAxis />
            <Tooltip
              formatter={(val, name, { payload }) => {
                if (name === "Price") return [`${val}`, "Price"];
                return val;
              }}
              labelFormatter={(lbl, payload) => {
                const p = payload && payload[0] && payload[0].payload;
                return `${lbl}\nVintage: ${p?.Vintage ?? "N/A"} | DA: ${
                  p?.DA_Start ?? "?"
                }–${p?.DA_Finish ?? "?"}`;
              }}
            />
            <Bar
              dataKey="Price"
              name="Price"
              isAnimationActive={false}
              shape={props => {
                const { x, y, width, height, payload } = props;
                const fill = barColor(payload.Vintage, payload.DA_Start, payload.DA_Finish);
                return <rect x={x} y={y} width={width} height={height} fill={fill} />;
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}