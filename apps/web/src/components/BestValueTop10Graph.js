import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function BestValueTop10Graph({ rows }) {
  if (!rows || rows.length === 0) {
    return <p>No data available for Best Value graph.</p>;
  }

  // Sort by PriceValueDiff
  const sorted = [...rows].sort((a, b) => a.PriceValueDiff - b.PriceValueDiff);
  const top10 = sorted.slice(0, 10);

  // Transform into segments for stacked bars
  const chartData = top10.map((wine) => {
    const preDrink = wine.DA_Start - wine.Vintage;
    const drinking = wine.DA_Finish - wine.DA_Start;
    const postDrink = Math.max(0, 2040 - wine.DA_Finish); // cap horizon

    return {
      label: `${wine.Product} ${wine.Vintage}`,
      preDrink,
      drinking,
      postDrink,
    };
  });

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>Drinking Windows (Top 10 Best Value Wines)</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 20, right: 40, bottom: 20, left: 150 }}
        >
          <XAxis
            type="number"
            domain={["dataMin", "dataMax"]}
            tickCount={15}
            allowDecimals={false}
            label={{ value: "Years since Vintage", position: "insideBottom", dy: 10 }}
          />
          <YAxis
            dataKey="label"
            type="category"
            width={200}
            tick={{ fontSize: 12 }}
          />
          <Tooltip />

          {/* Color segments */}
          <Bar dataKey="preDrink" stackId="a" fill="yellow" />
          <Bar dataKey="drinking" stackId="a" fill="green" />
          <Bar dataKey="postDrink" stackId="a" fill="red" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}