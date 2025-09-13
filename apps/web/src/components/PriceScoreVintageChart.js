// apps/web/src/components/PriceScoreVintageChart.js
import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceArea,
  Scatter,
  CartesianGrid,
} from "recharts";

/**
 * Previous working version (restored).
 * Expects data items to include:
 *   - Vintage (or vintage)
 *   - Price
 *   - Score (or score)
 *   - DA_Start
 *   - DA_Finish
 *   - Product
 *
 * Props:
 *  - data: array
 *  - highlightVintage: number | string (optional)
 *  - colorMap: { red, green, yellow } (optional; fallbacks provided)
 */
export default function PriceScoreVintageChart({ data, highlightVintage, colorMap }) {
  if (!data || data.length === 0) return <p>No data available</p>;

  // fallback colors (if index.js doesn't pass a colorMap)
  const colors = {
    red: (colorMap && colorMap.red) || "#D32F2F",
    green: (colorMap && colorMap.green) || "#4CAF50",
    yellow: (colorMap && colorMap.yellow) || "#FFC107",
  };

  // support both "Vintage" and "vintage" key names
  const vintageKey = data[0] && data[0].Vintage !== undefined ? "Vintage" : "vintage";
  const priceKey = data[0] && data[0].Price !== undefined ? "Price" : "price";
  const scoreKey = data[0] && data[0].Score !== undefined ? "Score" : "score";

  const vintages = data
    .map((d) => Number(d[vintageKey]))
    .filter((v) => !Number.isNaN(v));

  const minYear = Math.min(...vintages) - 3;
  const maxYear = Math.max(...vintages) + 3;

  // find highlight row if provided
  const hv = highlightVintage !== "" && highlightVintage != null ? Number(highlightVintage) : null;
  const highlightRow = hv !== null ? data.find((r) => Number(r[vintageKey]) === hv) : null;

  return (
    <div style={{ width: "100%", height: 500 }}>
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid />
          <XAxis
            type="number"
            dataKey={vintageKey}
            domain={[minYear, maxYear]}
            tickFormatter={(tick) => tick.toString()}
          />
          <YAxis dataKey="Product" type="category" width={150} />
          <Tooltip />

          {/* If there's a highlighted vintage, draw three background bands relative to that wine */}
          {highlightRow && (
            <>
              {/* Before DA_Start */}
              <ReferenceArea
                x1={minYear}
                x2={Number(highlightRow.DA_Start)}
                y1="dataMin"
                y2="dataMax"
                fill={colors.yellow}
                fillOpacity={0.2}
                stroke="none"
              />
              {/* Between DA_Start and DA_Finish */}
              <ReferenceArea
                x1={Number(highlightRow.DA_Start)}
                x2={Number(highlightRow.DA_Finish)}
                y1="dataMin"
                y2="dataMax"
                fill={colors.green}
                fillOpacity={0.2}
                stroke="none"
              />
              {/* After DA_Finish */}
              <ReferenceArea
                x1={Number(highlightRow.DA_Finish)}
                x2={maxYear}
                y1="dataMin"
                y2="dataMax"
                fill={colors.red}
                fillOpacity={0.2}
                stroke="none"
              />
            </>
          )}

          {/* All points */}
          <Scatter
            name="Wines"
            data={data.map((d) => ({
              ...d,
              [vintageKey]: Number(d[vintageKey]) || 0,
              [priceKey]: Number(d[priceKey]) || 0,
              [scoreKey]: Number(d[scoreKey]) || 0,
            }))}
            dataKey={priceKey}
            fill="#8884d8"
          />

          {/* Highlighted vintage point (if any) */}
          {highlightRow && (
            <Scatter
              name="Selected Vintage"
              data={[
                {
                  ...highlightRow,
                  [vintageKey]: Number(highlightRow[vintageKey]),
                  [priceKey]: Number(highlightRow[priceKey]),
                },
              ]}
              dataKey={priceKey}
              fill="#000"
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
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}