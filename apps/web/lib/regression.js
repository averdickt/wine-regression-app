import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Scatter
} from 'recharts';

const RegressionChart = ({ data }) => {
  const [selectedProduct, setSelectedProduct] = useState('');

  // Extract unique product names for dropdown
  const products = useMemo(() => {
    const unique = [...new Set(data.map(d => d.product))];
    return unique.sort();
  }, [data]);

  // Filter data for the selected product
  const filteredData = useMemo(() => {
    if (!selectedProduct) return [];
    return data.filter(d => d.product === selectedProduct);
  }, [data, selectedProduct]);

  return (
    <div>
      <h3>Regression Line vs Critic Scores</h3>

      {/* Product Selector */}
      <label>
        Select Product:{" "}
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
        >
          <option value="">-- Choose a product --</option>
          {products.map((prod, idx) => (
            <option key={idx} value={prod}>
              {prod}
            </option>
          ))}
        </select>
      </label>

      {/* Chart only shows when a product is selected */}
      {selectedProduct && (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="vintage" />
            <YAxis
              yAxisId="left"
              label={{ value: 'Price (£)', angle: -90, position: 'insideLeft' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: 'Score', angle: -90, position: 'insideRight' }}
            />
            <Tooltip />
            <Legend />

            {/* Regression Line (Price) */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="price"
              stroke="#8884d8"
              name="Regression Price"
              dot={false}
            />

            {/* Score Dots */}
            <Scatter
              yAxisId="right"
              name="Score"
              data={filteredData}
              fill="#82ca9d"
              shape="circle"
              dataKey="score"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default RegressionChart;
