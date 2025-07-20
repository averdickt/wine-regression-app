import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const RegressionChart = ({ data }) => {
  return (
    <div>
      <h3>Price Regression by Vintage</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="vintage" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="price" stroke="#8884d8" name="Regression Price" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RegressionChart;
