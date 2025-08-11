import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line
} from "recharts";
import { fitBestRegression } from "../utils/regression";

const Graph1 = ({ wineData, selectedProduct, selectedRegion, selectedScore }) => {
  // Filter data for this product & region
  const filteredData = wineData.filter(d => {
    return (
      (!selectedProduct || d.Product === selectedProduct) &&
      (!selectedRegion || selectedRegion === "all" || d.Region === selectedRegion)
    );
  });

  // Prepare regression input
  const regressionInput = filteredData.map(d => ({
    score: Number(d.Score),
    price: Number(d.Price_to_use),
    year: Number(d.Vintage)
  }));

  // Run regression
  const regressionResult = fitBestRegression(regressionInput, selectedScore);

  // Calculate premium/discount for the selected wine if applicable
  let premiumPct = null;
  let premiumAbs = null;
  if (selectedScore && regressionResult.predictedPrice) {
    const selectedWine = regressionInput.find(d => d.score === selectedScore);
    if (selectedWine) {
      premiumAbs = selectedWine.price - regressionResult.predictedPrice;
      premiumPct = (premiumAbs / regressionResult.predictedPrice) * 100;
    }
  }

  return (
    <div>
      <ScatterChart
        width={800}
        height={400}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <CartesianGrid />
        <XAxis
          type="number"
          dataKey="score"
          name="Score"
          domain={['dataMin - 1', 'dataMax + 1']}
        />
        <YAxis
          type="number"
          dataKey="price"
          name="Price"
          domain={['dataMin - 500', 'dataMax + 500']}
        />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        <Legend />

        {/* Scatter plot of years */}
        <Scatter name="Vintages" data={regressionInput} fill="#8884d8" />

        {/* Regression line */}
        {regressionResult.points.length > 0 && (
          <Line
            type="monotone"
            dataKey="price"
            data={regressionResult.points}
            stroke="#82ca9d"
            dot={false}
            name={`${regressionResult.type} regression`}
          />
        )}
      </ScatterChart>

      {/* Wine price summary */}
      {premiumAbs !== null && (
        <div style={{ marginTop: "10px" }}>
          <strong>Selected Wine Analysis:</strong>
          <div>Predicted Price: £{regressionResult.predictedPrice?.toFixed(2)}</div>
          <div>Premium/Discount: £{premiumAbs.toFixed(2)} ({premiumPct.toFixed(2)}%)</div>
        </div>
      )}
    </div>
  );
};

export default Graph1;
