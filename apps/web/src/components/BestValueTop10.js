import React, { useMemo, useEffect } from "react";
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
  // — Find the selected wine —
  const selectedRow = rows.find(
    (r) => r.Product === selectedProduct && r.Vintage === selectedVintage
  );
  const selectedScore = selectedRow?.Score;
  const region = selectedRow?.Region;
  const wineClass = selectedRow?.Wine_Class;

  // — Filter and sort top 10 wines —
  const top10 = useMemo(() => {
    if (!selectedScore || !region || !wineClass) return [];

    const filtered = rows
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
        DrinkingWindowStart: r.DA_Start,
        DrinkingWindowWidth: r.DA_Finish - r.DA_Start,
      }))
      .sort((a, b) => a.PriceValueDiff - b.PriceValueDiff)
      .slice(0, 10);

    return filtered;
  }, [rows, selectedScore, region, wineClass]);

  // — Early return if no valid selection —
  if (!selectedScore) {
    return <p>Please select a Product and Vintage with a score.</p>;
  }
  if (top10.length === 0) {
    return (
      <p>
        No matching wines found for Region: {region}, Class: {wineClass}, Score:{" "}
        {selectedScore}.
      </p>
    );
  }

  // — Determine x-axis range —
  const minStart = Math.min(...top10.map((r) => r.DA_Start)) - 3;
  const maxFinish = Math.max(...top10.map((r) => r.DA_Finish)) + 3;

  // — Segment coloring —
  const currentYear = 2025;
  const getSegmentColors = (start, finish) => {
    const segments = [];
    if (currentYear < start) {
      segments.push({ start, end: finish, color: "yellow" });
    } else if (currentYear > finish) {
      segments.push({ start, end: finish, color: "red" });
    } else {
      if (start < currentYear) {
        segments.push({ start, end: currentYear, color: "yellow" });
      }
      segments.push({
        start: Math.max(start, currentYear),
        end: finish,
        color: "green",
      });
    }
    return segments;
  };

  // — Debug logs —
  useEffect(() => {
    console.log("Rendered top10:", top10);
    console.log("Final X-axis range used:", { minStart, maxFinish });
  }, [top10, minStart, maxFinish]);

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
            const bottles = parseInt(r.Case_Format?.split(" x ")[0], 10) || 12;
            return (
              <tr key={i}>
                <td style={{ border: "1px solid #ccc", padding: "6px" }}>{r.Region}</td>
                <td style={{ border: "1px solid #ccc", padding: "6px" }}>{r.Product}</td>
                <td style={{ border: "1px solid #ccc", padding: "6px" }}>{r.Vintage}</td>
                <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                  ${r.Price?.toFixed(2)}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                  ${r.PriceValueDiff?.toFixed(2)}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "6px" }}>{r.Bid_Qty}</td>
                <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                  ${(r.Bid_Per_Case / bottles).toFixed(2)}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                  {r.Spread?.toFixed(4)}
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
            margin={{ top: 20, right: 30, left: 120, bottom: 20 }}
          >
            <XAxis
              type="number"
              domain={[minStart, maxFinish]}
              tickFormatter={(value) => Math.round(value)}
              label={{
                value: "Drinking Window (Years)",
                position: "insideBottom",
                offset: -5,
              }}
            />
            <YAxis dataKey="Label" type="category" width={200} tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(_, __, props) => [
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
                const { y, height, payload, xScale } = props;
                if (!payload || !xScale) {
                  console.warn("Missing payload or xScale for custom bar shape");
                  return null;
                }

                const segments = getSegmentColors(
                  payload.DA_Start,
                  payload.DA_Finish
                );

                return (
                  <g>
                    {segments.map((seg, i) => {
                      const segStart = xScale(seg.start);
                      const segEnd = xScale(seg.end);
                      const rectX = Math.min(segStart, segEnd);
                      const rectWidth = Math.abs(segEnd - segStart);

                      return (
                        <rect
                          key={i}
                          x={rectX}
                          y={y}
                          width={rectWidth}
                          height={height}
                          fill={seg.color}
                        />
                      );
                    })}
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