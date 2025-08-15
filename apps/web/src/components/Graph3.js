import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import wineData from '../utils';

export default function Graph3({ selectedProduct, selectedVintage, tickWineClass }) {
  if (!selectedProduct || !selectedVintage) {
    return <div>Please select a product and vintage.</div>;
  }

  // 1️⃣ Find the score for the selected product & vintage
  const targetWine = wineData.find(
    w => w.Product === selectedProduct && w.Vintage === selectedVintage
  );
  if (!targetWine) {
    return <div>No matching wine found.</div>;
  }
  const targetScore = targetWine.Score;

  // 2️⃣ Filter wines with same score
  let filtered = wineData.filter(w => w.Score === targetScore);

  // Optional WineClass filter
  if (tickWineClass) {
    filtered = filtered.filter(w => w.WineClass === targetWine.WineClass);
  }

  // 3️⃣ Group by region + vintage, calculate average price
  const grouped = {};
  filtered.forEach(w => {
    const key = `${w.Region}__${w.Vintage}`;
    if (!grouped[key]) {
      grouped[key] = { Region: w.Region, Vintage: w.Vintage, prices: [] };
    }
    grouped[key].prices.push(w.Price);
  });

  const chartData = Object.values(grouped).map(g => ({
    Region: g.Region,
    Vintage: g.Vintage,
    AvgPrice: g.prices.reduce((a, b) => a + b, 0) / g.prices.length
  }));

  // 4️⃣ Add "All Wines" per vintage
  const vintageGroups = {};
  chartData.forEach(row => {
    if (!vintageGroups[row.Vintage]) vintageGroups[row.Vintage] = [];
    vintageGroups[row.Vintage].push(row.AvgPrice);
  });
  Object.entries(vintageGroups).forEach(([vintage, prices]) => {
    chartData.push({
      Region: 'All Wines',
      Vintage: vintage,
      AvgPrice: prices.reduce((a, b) => a + b, 0) / prices.length
    });
  });

  return (
    <div>
      <h3>
        Graph 3: Avg Price per Region & Vintage (Score = {targetScore}
        {tickWineClass ? ', WineClass filtered' : ''})
      </h3>
      <BarChart
        width={750}
        height={400}
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Region" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="AvgPrice" fill="#82ca9d" />
      </BarChart>
    </div>
  );
}
