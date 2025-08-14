import React from "react";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
  Line, Legend, ReferenceLine, ReferenceDot, Label
} from "recharts";
import { fitBestRegression } from "../utils/regression";
import wineData from '../utils/data';

export default function Graph1({ wineData, selectedProduct, selectedRegion, selectedScore }) {
  if (!wineData || wineData.length === 0) {
    return <div>No data available</div>;
  }

  // Run regression + get premium info
  const { type, predictedPrice, points, premiumAbs, premiumPct, r2 } = fitBestRegression(wineData, {
    product: selectedProduct,
    region: selectedRegion,
    targetScore: selectedScore
  });

  const filteredData = wineData.filter(d =>
    (!selectedProduct || d.Product === selectedProduct) &&
    (selectedRegion === "all" || d.Region === selectedRegion)
  );

  // Dot colour based on premium
  let dotColor = "red"; // default if no premium info
  if (premiumAbs !== null) {
    if (premiumAbs < 0) {
      dotColor = "green"; // underpriced
    } else if (premiumAbs > 0) {
      dotColor = "orange"; // overpriced
    }
  }

  // Regression line opacity based on R²
  let lineOpacity = 1;
  if (r2 < 0.5) {
    lineOpacity = 0.3;
  } else if (r2 < 0.8) {
    lineOpacity = 0.6;
  }

  // Confidence warnings
  let warning = null;
  if (r2 !== null) {
    if (r2 < 0.5) {
      warning = {
        bg: "#fff3cd",
        color: "#856404",
        border: "#ffeeba",
        text: `⚠ Fit may be unreliable — R² is only ${r2.toFixed(2)}`
      };
    } else if (r2 < 0.8) {
      warning = {
        bg: "#e2e3e5",
        color: "#383d41",
        border: "#d6d8db",
        text: `ℹ Moderate confidence — R² is ${r2.toFixed(2)}`
      };
    }
  }

  return (
    <div>
      <h3>
        Regression: {type ? type : "N/A"}{" "}
        {predictedPrice &&
          `| Predicted Price: £${predictedPrice.toFixed(2)} ${
            premiumAbs !== null
              ? `| Premium: £${premiumAbs.toFixed(2)} (${premiumPct.toFixed(1)}%)`
              : ""
          } | R²: ${r2 !== null ? r2.toFixed(3) : "N/A"}`}
      </h3>

      {warning && (
        <div style={{
          background: warning.bg,
          color: warning.color,
          padding: "10px",
          border: `1px solid ${warning.border}`,
          borderRadius: "4px",
          marginBottom: "10px"
        }}>
          {warning.text}
        </div>
      )}

      <ScatterChart width={800} height={400} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid />
        <XAxis type="number" dataKey="Score" name="Score" domain={['dataMin', 'dataMax']} />
        <YAxis type="number" dataKey="Price_to_use" name="Price (£)" />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        <Legend />

        {/* Scatter points */}
        <Scatter name="Wine Years" data={filteredData} fill="#8884d8" />

        {/* Regression line */}
        {points.length > 0 && (
          <Line
            type="monotone"
            dataKey="price"
            data={points}
            stroke="#82ca9d"
            strokeOpacity={lineOpacity}
            dot={false}
            name="Regression Line"
          />
        )}

        {/* Vertical marker + price dot */}
        {selectedScore && (
          <>
            <ReferenceLine
              x={selectedScore}
              stroke="red"
              strokeDasharray="3 3"
              label={{ value: `Score: ${selectedScore}`, angle: 90, position: 'insideTop', fill: 'red' }}
            />
            {predictedPrice && (
              <ReferenceDot
                x={selectedScore}
                y={predictedPrice}
                r={5}
                fill={dotColor}
                stroke="black"
              >
                <Label value={`£${predictedPrice.toFixed(0)}`} position="right" fill={dotColor} />
              </ReferenceDot>
            )}
          </>
        )}
      </ScatterChart>
    </div>
  );
}
