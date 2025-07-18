import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Scatter } from 'recharts';

const data = [
  { year: 2000, score: 95, price: 300 },
  { year: 2001, score: 92, price: 250 },
  { year: 2002, score: 100, price: 180 }, // standout value
  { year: 2003, score: 96, price: 310 },
  { year: 2004, score: 94, price: 320 },
];

function App() {
  return (
    <div style={{ width: '100%', height: 400 }}>
      <h2>Wine Price vs Score Regression</h2>
      <ResponsiveContainer>
        <ScatterChart>
          <CartesianGrid />
          <XAxis dataKey="year" name="Year" />
          <YAxis dataKey="price" name="Price (£)" />
          <Tooltip />
          <Scatter name="Wines" data={data} fill="#800020" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

export default App;