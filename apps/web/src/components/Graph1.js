import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Scatter
} from 'recharts';

export default function RegressionChart({ data, regressionPerBottle, regressionPerCase }) {
  const [view, setView] = useState("perBottle"); // toggle state

  // Choose dataset depending on toggle
  const { dataForChart, regression } = useMemo(() => {
    if (view === "perCase") {
      return { dataForChart: data.map(d => ({ ...d, price: d.priceCase })), regression: regressionPerCase };
    } else {
      return { dataForChart: data.map(d => ({ ...d, price: d.priceBottle })), regression: regressionPerBottle };
    }
  }, [view, data, regressionPerBottle, regressionPerCase]);

  if (!dataForChart || dataForChart.length === 0) return <p>No data available</p>;
  if (!regression) return <p>Regression not calculated</p>;

  // Compute axis bounds
  const scores = dataForChart.map(d => parseFloat(d.score));
  const prices = dataForChart.map(d => parseFloat(d.price));

  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);
  const maxPrice = Math.max(...prices);

  return (
    <div>
      {/* Toggle */}
      <div style={{ marginBottom: '10px' }}>
        <button
          onClick={() => setView("perBottle")}
          style={{ marginRight: "10px", background: view === "perBottle" ? "#ddd" : "#fff" }}
        >
          Per Bottle
        </button>
        <button
          onClick={() => setView("perCase")}
          style={{ background: view === "perCase" ? "#ddd" : "#fff" }}
        >
          Per Case
        </button>
      </div>

      {/* Chart */}
      <LineChart
        width={900}
        height={500}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="score"
          type="number"
          domain={[Math.floor(minScore) - 3, Math.ceil(maxScore)]}
          label={{ value: "Score", position: "insideBottom", offset: -5 }}
        />
        <YAxis
          type="number"
          domain={[0, Math.ceil(maxPrice * 1.1)]}
          label={{ value: `Price (${view === "perBottle" ? "per bottle" : "per case"})`, angle: -90, position: "insideLeft" }}
        />
        <Tooltip />
        <Legend />

        {/* Scatter points */}
        <Scatter name="Wine Data" data={dataForChart} fill="blue" />

        {/* Regression line */}
        <Line
          name={`Regression (R²=${regression.r2.toFixed(2)})`}
          data={regression.points}
          type="linear"
          dataKey="price"
          stroke="red"
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </div>
  );
}
