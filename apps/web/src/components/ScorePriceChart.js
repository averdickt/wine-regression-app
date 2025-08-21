import React, { useState, useMemo } from 'react';
import {
  ComposedChart, Bar, Scatter, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const ScorePriceChart = ({ data }) => {
  const [selectedProduct, setSelectedProduct] = useState('');

  // Unique products for dropdown
  const products = useMemo(() => {
    return [...new Set(data.map(d => d.product))].sort();
  }, [data]);

  // Filter data by product
  const filteredData = useMemo(() => {
    if (!selectedProduct) return [];
    return data.filter(d => d.product === selectedProduct);
  }, [data, selectedProduct]);

  return (
    <div>
      <h3>Bar + Dot Chart: Price vs Year with Score</h3>
      <label>
        Select Product:{" "}
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
        >
          <option value="">-- Choose a product --</option>
          {products.map((prod, idx) => (
            <option key={idx} value={prod}>{prod}</option>
          ))}
        </select>
      </label>

      {selectedProduct && (
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="vintage" label={{ value: "Year", position: "insideBottom", offset: -5 }} />
            <YAxis
              yAxisId="left"
              orientation="left"
              label={{ value: "Price (£ per bottle)", angle: -90, position: "insideLeft" }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: "Score", angle: 90, position: "insideRight" }}
            />
            <Tooltip />
            <Legend />

            {/* Bars = price */}
            <Bar yAxisId="left" dataKey="price" fill="#8884d8" name="Price (£ per bottle)" />

            {/* Dots = score */}
            <Scatter yAxisId="right" dataKey="score" fill="#82ca9d" name="Score" />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ScorePriceChart;
