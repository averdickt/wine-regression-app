import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  LabelList,
  Legend,
} from "recharts";

export default function BestValueTop10({ rows, selectedProduct, selectedVintage }) {
  const selectedRow = rows.find(
    (r) => r.Product === selectedProduct && r.Vintage === selectedVintage
  );
  const selectedScore = selectedRow?.Score;
  const region = selectedRow?.Region;
  const wineClass = selectedRow?.Wine_Class;

  const top10 = useMemo(() => {
    if (!selectedScore || !region || !wineClass) return [];

    return rows
      .filter(
        (r) =>
          r.Region === region &&
          r.Wine_Class === wineClass &&
          r.Score === selectedScore &&
          r.DA_Start &&
          r.DA_Finish &&
          r.DA_Start >= 1900 &&
          r.DA_Finish >= r.DA_Start
      )
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
    return (
      <p>
        No matching wines found for Region: {region}, Class: {wineClass}, Score: {selectedScore}.
      </p>
    );
  }

  const minStart = Math.min(...top10.map((r) => r.DA_Start)) - 3;
  const maxFinish = Math.max(...top10.map((r) => r.DA_Finish)) + 3;
  const currentYear = new Date().getFullYear();

  const getBottles = (caseFormat) => {
    if (!caseFormat) return 12;
    const num = parseInt(caseFormat.split(" x ")[0], 10);
    return isNaN(num) ? 12 : num;
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Top 10 Best Value Wines (Same Region, Class, and Score)</h2>

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
              "Bid_Per_Bottle",
              "Spread",
              "Offer_Per_Bottle",
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
          {top10.map((r, i) => {
            const bottles = getBottles(r.Case_Format);
            return (
              <tr key={i}>
                <td style={{ border: "1px solid #ccc", padding: "6px" }}>{r.Region}</td>
                <td style={{ border: "1px solid #ccc", padding: "6px" }}>{r.Product}</td>
                <td style={{ border: "1px solid #ccc", padding: "6px" }}>{r.Vintage}</td>
                <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                  ${r.Price.toFixed(2)}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                  ${r.PriceValueDiff.toFixed(2)}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "6px" }}>{r.Bid_Qty}</td>
                <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                  ${(r.Bid_Per_Case / bottles).toFixed(2)}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                  {r.Spread.toFixed(4)}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                  ${(r.Offer_Per_Case / bottles).toFixed(2)}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "6px" }}>{r.Offer_Qty}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* --- Graph --- */}
      <div style={{ width: "100%", height: 550 }}>
        <ResponsiveContainer>
          <ComposedChart
            layout="vertical"
            data={top10}
            margin={{ top: 20, right: 30, left: 150, bottom: 40 }}
          >
            <XAxis
              type="number"
              domain={[minStart, maxFinish]}
              allowDecimals={false}
              label={{
                value: "Drinking Window (Years)",
                position: "insideBottom",
                offset: -10,
              }}
            />
            <YAxis dataKey="Label" type="category" width={250} tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value, name, props) => [
                `${props.payload.DA_Start} – ${props.payload.DA_Finish}`,
                "Drinking Window",
              ]}
            />
            <Legend
              verticalAlign="top"
              height={36}
              formatter={(value) => {
                const colorMap = {
                  yellow: "Too Early",
                  green: "Drink Now",
                  red: "Past Best",
                };
                return colorMap[value] || value;
              }}
            />
            <Bar
              dataKey="DA_Finish"
              barSize={20}
              shape={(props) => {
                const { y, height, payload, xAxis } = props;
                const startX = xAxis.scale(payload.DA_Start);
                const endX = xAxis.scale(payload.DA_Finish);

                const segments = [];
                if (payload.DA_Start < currentYear) {
                  const preEnd = Math.min(currentYear, payload.DA_Finish);
                  segments.push({
                    x: startX,
                    width: xAxis.scale(preEnd) - startX,
                    color: "yellow",
                  });
                }
                if (payload.DA_Start <= currentYear && currentYear <= payload.DA_Finish) {
                  const greenStart = Math.max(payload.DA_Start, currentYear);
                  segments.push({
                    x: xAxis.scale(greenStart),
                    width: xAxis.scale(payload.DA_Finish) - xAxis.scale(greenStart),
                    color: "green",
                  });
                }
                if (payload.DA_Finish < currentYear) {
                  segments.push({
                    x: startX,
                    width: endX - startX,
                    color: "red",
                  });
                }

                return (
                  <g>
                    {segments.map((s, i) => (
                      <rect key={i} x={s.x} y={y} width={s.width} height={height} fill={s.color} />
                    ))}
                  </g>
                );
              }}
            >
              <LabelList
                dataKey={(d) => `${d.DA_Start}-${d.DA_Finish}`}
                position="insideRight"
                fill="#000"
              />
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}