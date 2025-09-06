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
  Legend,
} from "recharts";

export default function BestValueTop10({ rows, selectedProduct, selectedVintage }) {
  // --- Find the selected wine ---
  const selectedRow = rows.find(
    (r) => r.Product === selectedProduct && r.Vintage === selectedVintage
  );
  const selectedScore = selectedRow?.Score;
  const region = selectedRow?.Region;
  const wineClass = selectedRow?.Wine_Class;

  // --- Filter and sort top 10 wines ---
  const top10 = useMemo(() => {
    if (!selectedScore || !region || !wineClass) return [];

    const filtered = rows
      .filter(
        (r) =>
          r.Region === region &&
          r.Wine_Class === wineClass &&
          r.Score === selectedScore &&
          r.DA_Start && r.DA_Finish // Ensure valid drinking window
      )
      .map((r) => ({
        ...r,
        Label: `${r.Product} (${r.Vintage})`,
        DrinkingWindowStart: r.DA_Start,
        DrinkingWindowWidth: r.DA_Finish - r.DA_Start,
      }))
      .sort((a, b) => a.PriceValueDiff - b.PriceValueDiff)
      .slice(0, 10);

    console.log("Top 10 wines:", filtered); // Debug log
    return filtered;
  }, [rows, selectedScore, region, wineClass]);

  // --- Handle case format for per-bottle calculations ---
  const getBottles = (caseFormat) => {
    if (!caseFormat) return 12;
    const num = parseInt(caseFormat.split(" x ")[0], 10);
    return isNaN(num) ? 12 : num;
  };

  // --- Early return if no valid selection ---
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

  // --- Determine x-axis range ---
  const minStart = Math.min(...top10.map((r) => r.DA_Start || 2000)) - 3; // Dynamic start
  const maxFinish = Math.max(...top10.map((r) => r.DA_Finish || 2030)) + 3; // Dynamic end
  const xAxisRange = maxFinish - minStart; // Total range for scaling
  console.log("X-axis range:", { minStart, maxFinish }); // Debug X-axis range

  // --- Color bars by drinking window segments ---
  const currentYear = 2025;
  const getSegmentColors = (start, finish) => {
    const segments = [];
    const totalWidthPercent = 100; // Full width in percentage
    const startOffset = ((start - minStart) / xAxisRange) * totalWidthPercent;
    const windowWidthPercent = ((finish - start) / xAxisRange) * totalWidthPercent;

    if (start < currentYear) {
      const preCurrentWidth = Math.max((currentYear - start) / xAxisRange * totalWidthPercent, 0);
      segments.push({ x: startOffset, width: preCurrentWidth, color: "yellow" });
    }
    if (start <= currentYear && currentYear <= finish) {
      const greenStart = Math.max((currentYear - start) / xAxisRange * totalWidthPercent, 0);
      const greenWidth = Math.max((finish - currentYear) / xAxisRange * totalWidthPercent, 0);
      segments.push({ x: startOffset + greenStart, width: greenWidth, color: "green" });
    }
    if (finish > currentYear) {
      const postCurrentStart = Math.max((finish - currentYear) / xAxisRange * totalWidthPercent, 0);
      segments.push({ x: startOffset + postCurrentStart, width: windowWidthPercent - postCurrentStart, color: "red" });
    }
    return segments;
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
      <div style={{ width: "100%", height: 550 }}> {/* Increased height for legend */}
        <ResponsiveContainer>
          <ComposedChart
            layout="vertical"
            data={top10}
            margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
          >
            <XAxis
              type="number"
              domain={[minStart, maxFinish]}
              label={{ value: "Drinking Window (Years)", position: "insideBottom", offset: -5 }}
            />
            <YAxis dataKey="Label" type="category" width={200} tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value, name, props) => [
                `${props.payload.DA_Start} - ${props.payload.DA_Finish}`,
                "Drinking Window",
              ]}
            />
            <Legend
              verticalAlign="top"
              height={36}
              wrapperStyle={{ paddingBottom: "10px" }}
              formatter={(value) => {
                const colorMap = {
                  yellow: "Not drinkable",
                  green: "Drinkable",
                  red: "Past",
                };
                return colorMap[value] || value;
              }}
            />
            <Bar
              dataKey="DrinkingWindowWidth"
              barSize={20}
              shape={(props) => {
                const { x, y, payload, width: baseWidth, height } = props;
                const startOffset = ((payload.DA_Start - minStart) / xAxisRange) * baseWidth;
                const segments = getSegmentColors(payload.DA_Start, payload.DA_Finish);

                return (
                  <g>
                    {segments.map((segment, index) => (
                      <rect
                        key={index}
                        x={x + segment.x}
                        y={y}
                        width={segment.width}
                        height={height}
                        fill={segment.color}
                      />
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