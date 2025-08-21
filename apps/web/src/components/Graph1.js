import React, { useState, useMemo } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Line
} from 'recharts';
import regression from 'regression';

const Graph1 = ({ data }) => {
  const [selectedProduct, setSelectedProduct] = useState('');

  // Unique products for dropdown
  const products = useMemo(() => {
    return [...new Set(data.map(d => d.product))].sort();
  }, [data]);

  // Filter data by selected product
  const filteredData = useMemo(() => {
    if (!selectedProduct) return [];
    return data.filter(d => d.product === selectedProduct);
  }, [data, selectedProduct]);

  // Compute regression line (price vs score)
  const regressionData = useMemo(() => {
    if (filteredData.length < 2) return [];
    const points = filteredData.map(d => [d.score, d.price]);
    const result = regression.linear(points);

    return filteredData.map(d => ({
      score: d.score,
      regression: result.predict(d.score)[1],
    }));
  }, [filteredData]);

  return (
    <div>
      <h3>Scatter & Regression: Price vs Score (per bottle)</h3>
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
          <ScatterChart>
            <CartesianGrid />
            <XAxis dataKey="score" name="Score" />
            <YAxis dataKey="price" name="Price (£ per bottle)" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Legend />

            <Scatter
              name={selectedProduct}
              data={filteredData}
              fill="#8884d8"
            />

            {regressionData.length > 0 && (
              <Line
                type="linear"
                data={regressionData}
                dataKey="regression"
                stroke="#82ca9d"
                dot={false}
              />
            )}
          </ScatterChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default Graph1;
