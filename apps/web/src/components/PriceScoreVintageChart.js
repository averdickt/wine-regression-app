import React from "react";
import {
  ComposedChart,
  Bar,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function PriceScoreVintageChart({
  data,
  highlightVintage,
  colorMap,
}) {
  if (!data || data.length === 0) return null;

  const currentYear = new Date().getFullYear();

  // Get selected vintage details
  const selected =
    highlightVintage &&
    data.find((d) => String(d.Vintage) === String(highlightVintage));

  return (
    <div>
      <ComposedChart width={700} height={400} data={data}>
        <CartesianGrid />
        <XAxis
          dataKey="Vintage"
          angle={-45}
          textAnchor="end"
          interval={0}
          height={60}
        />
        <YAxis
          yAxisId="left"
          label={{ value: "Price", angle: -90, position: "insideLeft" }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          domain={["dataMin - 1", 100]}
          label={{ value: "Score", angle: 90, position: "insideRight" }}
        />
        <Tooltip
          formatter={(value, key) => {
            if (key === "Price") return [`$${value}`, "Price"];
            if (key === "Score") return [value, "Score"];
            return value;
          }}
          labelFormatter={(label, payload) => {
            if (payload && payload.length > 0) {
              const { DA_Start, DA_Finish } = payload[0].payload;
              return `Vintage: ${label}\nDrinking Window: ${DA_Start}–${DA_Finish}`;
            }
            return `Vintage: ${label}`;
          }}
        />
        <Legend
          verticalAlign="top"
          align="center"
          wrapperStyle={{ paddingBottom: "20px" }}
          payload={[
            { value: "Pre-drinking", type: "square", color: colorMap.yellow },
            { value: "Drinking", type: "square", color: colorMap.green },
            { value: "Post-drinking", type: "square", color: colorMap.red },
            { value: "Highlighted", type: "square", color: "blue" },
          ]}
        />

        <Bar
          yAxisId="left"
          dataKey="Price"
          shape={(props) => {
            const { x, y, width, height, payload } = props;
            let color = colorMap.yellow; // default fallback

            if (currentYear < payload.DA_Start) {
              color = colorMap.yellow; // pre-drinking
            } else if (currentYear > payload.DA_Finish) {
              color = colorMap.red; // post-drinking
            } else {
              color = colorMap.green; // drinking
            }

            if (
              highlightVintage &&
              String(payload.Vintage) === String(highlightVintage)
            ) {
              color = "blue"; // highlight override
            }

            return (
              <rect x={x} y={y} width={width} height={height} fill={color} />
            );
          }}
        />

        <Scatter
          yAxisId="right"
          dataKey="Score"
          fill="black"
          shape={(props) => {
            const { cx, cy, payload } = props;
            return (
              <circle
                cx={cx}
                cy={cy}
                r={
                  highlightVintage &&
                  String(payload.Vintage) === String(highlightVintage)
                    ? 8
                    : 4
                }
                fill={
                  highlightVintage &&
                  String(payload.Vintage) === String(highlightVintage)
                    ? "red"
                    : "black"
                }
              />
            );
          }}
        />
      </ComposedChart>

      {/* --- Details Panel --- */}
      {selected && (
        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            backgroundColor: "#fafafa",
            width: "fit-content",
          }}
        >
          <h3 style={{ margin: "0 0 10px 0" }}>
            {selected.Product} ({selected.Vintage})
          </h3>
          <table
            style={{
              borderCollapse: "collapse",
              width: "100%",
              fontSize: "14px",
            }}
          >
            <tbody>
              <tr>
                <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                  <strong>Bid</strong>
                </td>
                <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                  {selected.Bid_Qty} @ ${selected.Bid_Per_Case}
                </td>
              </tr>
              <tr>
                <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                  <strong>Offer</strong>
                </td>
                <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                  {selected.Offer_Qty} @ ${selected.Offer_Per_Case}
                </td>
              </tr>
              <tr>
                <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                  <strong>Spread</strong>
                </td>
                <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                  {selected.Spread}%
                </td>
              </tr>
              <tr>
                <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                  <strong>Drinking Window</strong>
                </td>
                <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                  {selected.DA_Start} – {selected.DA_Finish}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}