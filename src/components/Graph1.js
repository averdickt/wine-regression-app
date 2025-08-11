import React from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Line, Legend } from "recharts";
import { fitBestRegression } from "../utils/regression";

export default function Graph1({ wineData, selectedProduct, selectedRegion, selectedScore }) {
  if (!wineData || wineData.length === 0) {
    return <div>No data available</div>;
  }

  // Run regression + get premium info
  const { type, predictedPrice, points, premiumAbs, premiumPct } = fitBestRegression(wineData, {
    product: selectedProduct,
    region: selectedRegion,
    targetScore: selectedScore
  });

  return (
    <div>
      <h3>
        Regression: {type ? type : "N/A"}{" "}
        {predictedPrice &&
          `| Predicted Price: £${predictedPrice.toFixed(2)} ${
            premiumAbs !== null
              ? `| Premium: £${premiumAbs.toFixed(2)} (${premiumPct.toFixed(1)}%)`
              : ""
          }`}
      </h3>

      <ScatterChart width={800} height={400} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid />
        <XAxis type="number" dataKey="Score" name="Score" domain={['dataMin', 'dataMax']} />
        <YAxis type="number" dataKey="Price_to_use" name="Price (£)" />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        <Legend />

        {/* Scatter points (each year is a datapoint) */}
        <Scatter
          name="Wine Years"
          data={wineData.filter(d =>
            (!selectedProduct || d.Product === selectedProduct) &&
            (selectedRegion === "all" || d.Region === selectedRegion)
          )}
          fill="#8884d8"
        />

        {/* Regression line */}
        {points.length > 0 && (
          <Line
            type="monotone"
            dataKey="price"
            data={points}
            stroke="#82ca9d"
            dot={false}
            name="Regression Line"
          />
        )}
      </ScatterChart>
    </div>
  );
}
