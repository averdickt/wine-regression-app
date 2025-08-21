import React, { useState, useMemo } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line
} from 'recharts';

const Graph1 = ({ data }) => {
  const [selectedProduct, setSelectedProduct] = useState('');

  // Unique product list
  const products = useMemo(() => {
    return [...new Set(data.map(d => d.product))].sort();
  }, [data]);

  // Filtered data for selected product
  const filteredData = useMemo(() => {
    if (!selectedProduct) return [];
    return data.filter(d => d.product === selectedProduct);
  }, [data, selectedProduct]);

  return (
    <div>
      <h3>Price vs Score Scatter (Per Bottle)</h3>
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

            {/* Optional regression line if you calculate it separately */}
            <Line
              type="monotone"
              dataKey="regression"
              data={filteredData}
              stroke="#82ca9d"
              dot={false}
            />
          </ScatterChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default Graph1;
