import React from 'react';
import { ComposedChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Scatter } from 'recharts';
import wineData from 'utils/data';
import { getBarColor } from 'utils/colors';

export default function Graph2({ selectedProduct, selectedVintage, tickWineClass }) {
  let filtered = wineData.filter(row => {
    if (selectedProduct && row.Product !== selectedProduct) return false;
    return true;
  });

  if (tickWineClass) {
    filtered = filtered.filter(row => row.WineClass === wineData.find(w => w.Product === selectedProduct)?.WineClass);
  }

  const today = new Date();
  const chartData = filtered.map(row => ({
    Year: row.Vintage,
    Price: row.Price,
    Score: row.Score,
    BarColor: getBarColor(today, row.DAStart, row.DAFinish)
  }));

  return (
    <div>
      <h3>Graph 2: Price & Score over Years</h3>
      <ComposedChart width={700} height={400} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Year" />
        <YAxis yAxisId="left" orientation="left" dataKey="Price" />
        <YAxis yAxisId="right" orientation="right" dataKey="Score" />
        <Tooltip />
        <Bar yAxisId="left" dataKey="Price" fill={({ BarColor }) => BarColor} />
        <Scatter yAxisId="right" dataKey="Score" fill="#000" />
      </ComposedChart>
    </div>
  );
}
