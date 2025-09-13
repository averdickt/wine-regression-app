// /apps/web/src/components/PriceScoreVintageChart.js
import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
} from "recharts";

/**
 * Props:
 *  - data: array (each item should have Vintage, Price, Score, DA_Start, DA_Finish, Product)
 *  - highlightVintage: number or string (the vintage to highlight -> will show background bands)
 *  - colorMap: { red, green, yellow } (colors passed from index.js)
 */
export default function PriceScoreVintageChart({ data, highlightVintage, colorMap }) {
  if (!data || data.length === 0) return <p>No data available</p>;

  // fallback colors if none passed
  const colors = {
    red: (colorMap && colorMap.red) || "#D32F2F",
    green: (colorMap && colorMap.green) || "#4CAF50",
    yellow: (colorMap && colorMap.yellow) || "#FFC107",
  };

  // numeric vintages
  const vintages = data.map((d) => Number(d.Vintage)).filter((v) => !isNaN(v));
  const minVintage = Math.min(...vintages) - 3;
  const maxVintage = Math.max(...vintages) + 3;

  // find highlighted row (match numeric)
  const hvNum = highlightVintage !== "" && highlightVintage != null ? Number(highlightVintage) : null;
  const highlightRow = hvNum ? data.find((r) => Number(r.Vintage) === hvNum) : null;

  // prepare scatter points (ensure numbers)
  const scatterData = data.map((d) => ({
    Vintage: Number(d.Vintage) || 0,
    Price: Number(d.Price) || 0,
    Score: Number(d.Score) || 0,
    ...d,
  }));

  return (
    <div style={{ width: "100%", height: 420 }}>
      <ResponsiveContainer>
        <ScatterChart margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
          <CartesianGrid />
          <XAxis
            type="number"
            dataKey="Vintage"
            domain={[minVintage, maxVintage]}
            tickFormatter={(t) => `${t}`}
            name="Vintage"
          />
          <YAxis type="number" dataKey="Price" name="Price" />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            formatter={(value, name, props) => {
              if (name === "Price") return [`$${value}`, "Price"];
              if (name === "Vintage") return [`${value}`, "Vintage"];
              if (name === "Score") return [value, "Score"];
              return [value, name];
            }}
            labelFormatter={() => ""}
          />

          {/* Only show background bands if we found a matching highlighted row */}
          {highlightRow && (
            <>
              {/* Pre-window (before DA_Start) -> yellow */}
              <ReferenceArea
                x1={minVintage}
                x2={Number(highlightRow.DA_Start)}
                y1="dataMin"
                y2="dataMax"
                fill={colors.yellow}
                fillOpacity={0.20}
                stroke="none"
              />
              {/* Drinking window -> green */}
              <ReferenceArea
                x1={Number(highlightRow.DA_Start)}
                x2={Number(highlightRow.DA_Finish)}
                y1="dataMin"
                y2="dataMax"
                fill={colors.green}
                fillOpacity={0.20}
                stroke="none"
              />
              {/* Post-window -> red */}
              <ReferenceArea
                x1={Number(highlightRow.DA_Finish)}
                x2={maxVintage}
                y1="dataMin"
                y2="dataMax"
                fill={colors.red}
                fillOpacity={0.20}
                stroke="none"
              />
            </>
          )}

          {/* all points */}
          <Scatter
            name="Wines"
            data={scatterData}
            fill="#8884d8"
            line={false}
            shape="circle"
          />

          {/* highlighted vintage point (bigger, outlined) */}
          {highlightRow && (
            <Scatter
              name="Selected Vintage"
              data={[{ ...highlightRow, Vintage: Number(highlightRow.Vintage), Price: Number(highlightRow.Price) }]}
              fill="#000"
              line={false}
              shape={(props) => {
                const { cx, cy } = props;
                return (
                  <g>
                    <circle cx={cx} cy={cy} r={8} fill="#000" stroke="#fff" strokeWidth={1.5} />
                  </g>
                );
              }}
            />
          )}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}