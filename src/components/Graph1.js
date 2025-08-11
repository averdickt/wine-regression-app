import React from "react";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Line, ResponsiveContainer
} from "recharts";
import { fitBestRegression } from "../utils/regression";

export default function Graph1({ data, selectedWine, selectedVintage }) {
  if (!data || data.length === 0) {
    return <p>No data available for Graph 1</p>;
  }

  // Filter for the selected wine
  const wineData = data.filter(d => d.Product === selectedWine);

  // Prepare regression input
  const regressionInput = wineData.map(d => ({
    score: d.Score,
    price: d.Price_to_use
  }));

  // Score + price of the selected vintage
  const selectedPoint = wineData.find(d => d.Vintage === selectedVintage);
  const selectedScore = selectedPoint ? selectedPoint.Score : null;
  const selectedPrice = selectedPoint ? selectedPoint.Price_to_use : null;

  // Run regression
  const regressionResult = fitBestRegression(regressionInput, selectedScore);

  // Create regression line points
  const scoreMin = Math.min(...regressionInput.map(p => p.score));
  const scoreMax = Math.max(...regressionInput.map(p => p.score));
  const regressionLinePoints = [];
  for (let s = scoreMin; s <= scoreMax; s += 0.1) {
    regressionLinePoints.push({
      score: s,
      price: regressionResult.type === "linear"
        ? regressionResult.slope * s + regressionResult.intercept
        : regressionResult.residuals[0].predicted // poly handled inside helper
    });
  }

  // Calculate premium/discount
  const premiumPct = selectedPrice && regressionResult.predictedPrice
    ? ((selectedPrice - regressionResult.predictedPrice) / regressionResult.predictedPrice) * 100
    : null;

  return (
    <div>
      <h3>Price vs Score Trend</h3>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" dataKey="score" name="Score" domain={['dataMin', 'dataMax']} />
          <YAxis type="number" dataKey="price" name="Price (£)" />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            formatter={(value, name) => name === "price"
              ? `£${value.toLocaleString()}`
              : value}
          />
          {/* Scatter points */}
          <Scatter
            name="All Vintages"
            data={regressionInput}
            fill="#8884d8"
          />
          {/* Highlight selected vintage */}
          {selectedPoint && (
            <Scatter
              name={`Selected Vintage: ${selectedVintage}`}
              data={[{ score: selectedScore, price: selectedPrice }]}
              fill="red"
              shape="star"
            />
          )}
          {/* Regression line */}
          <Line
            type="monotone"
            dataKey="price"
            data={regressionLinePoints}
            stroke="#82ca9d"
            dot={false}
          />
        </ScatterChart>
      </ResponsiveContainer>

      {/* Info Panel */}
      {selectedPoint && (
        <div style={{ marginTop: "10px" }}>
          <strong>{selectedWine} {selectedVintage}</strong><br />
          Last Traded Price: £{selectedPoint.Last_Trade_Price?.toLocaleString() || "N/A"}<br />
          Bid: £{selectedPoint.Bid_Per_Case?.toLocaleString() || "N/A"}<br />
          Offer: £{selectedPoint.Offer_Per_Case?.toLocaleString() || "N/A"}<br />
          Premium/Discount to Trend: {premiumPct !== null
            ? `${premiumPct > 0 ? "+" : ""}${premiumPct.toFixed(1)}%`
            : "N/A"}<br />
          (Predicted: £{regressionResult.predictedPrice?.toLocaleString() || "N/A"})
        </div>
      )}
    </div>
  );
}
