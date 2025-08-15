import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import wineData from 'utils/data';
import { getDrinkWindowColor } from 'utils/colors';

export default function Graph4({ selectedProduct, selectedVintage, tickWineClass }) {
  let filtered = wineData.filter(row => {
    if (selectedProduct && row.Product !== selectedProduct) return false;
    return true;
  });

  if (tickWineClass) {
    filtered = filtered.filter(row => row.WineClass === wineData.find(w => w.Product === selectedProduct)?.WineClass);
  }

  const minStart = Math.min(...filtered.map(r => r.DAStart));
  const maxFinish = Math.max(...filtered.map(r => r.DAFinish));

  const chartData = filtered.map(row => ({
    Vintage: row.Vintage,
    Start: row.DAStart,
    Finish: row.DAFinish
  }));

  return (
    <div>
      <h3>Graph 4: Drink Window per Vintage</h3>
      <BarChart
        width={700}
        height={400}
        data={chartData}
        layout="vertical"
        margin={{ left: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" domain={[minStart - 5, maxFinish + 5]} />
        <YAxis dataKey="Vintage" type="category" />
        <Tooltip />
        <Bar dataKey="Finish" fill="#8884d8">
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getDrinkWindowColor(entry)} />
          ))}
        </Bar>
      </BarChart>
    </div>
  );
}
