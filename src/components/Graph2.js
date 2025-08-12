import React, { useMemo } from "react";
import {
  ComposedChart,
  Bar,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Graph2 = ({ wineData, selectedProduct }) => {
  const today = new Date();

  const getBarColor = (startYear, endYear) => {
    const start = new Date(`${startYear}-01-01`);
    const end = new Date(`${endYear}-12-31`);

    if (today > end) {
      // Red scale
      const diffYears = (today - end) / (1000 * 60 * 60 * 24 * 365);
      const intensity = Math.min(diffYears / 10, 1); // max dark after 10+ years past
      return `rgb(${200 + intensity * 55}, 0, 0)`; // dark red
    } else if (today < start) {
      // Yellow scale
      const diffYears = (start - today) / (1000 * 60 * 60 * 24 * 365);
      const intensity = Math.min(diffYears / 10, 1);
      return `rgb(255, ${255 - intensity * 55}, 0)`; // darker yellow
    } else {
      // Green scale
      const total = (end - start) / (1000 * 60 * 60 * 24 * 365);
      const progress = (today - start) / (1000 * 60 * 60 * 24 * 365);
      const intensity = progress / total; // 0 = start, 1 = finish
      return `rgb(0, ${150 + intensity * 105}, 0)`; // green gradient
    }
  };

  const filteredData = useMemo(() => {
    return wineData
      .filter((wine) => wine.Product === selectedProduct)
      .map((wine) => ({
        year: wine.Vintage,
        price: wine.Price_to_use,
        score: wine.Score,
        daStart: wine["DA Start"],
        daFinish: wine["DA Finish"],
        fill: getBarColor(wine["DA Start"], wine["DA Finish"]),
      }))
      .sort((a, b) => a.year - b.year);
  }, [wineData, selectedProduct]);

  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <ComposedChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis
            yAxisId="left"
            orientation="left"
            label={{
              value: "Price",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{
              value: "Score",
              angle: -90,
              position: "insideRight",
            }}
          />
          <Tooltip />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="price"
            name="Price"
            fill="#8884d8"
            isAnimationActive={false}
          >
            {filteredData.map((entry, index) => (
              <cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
          <Scatter
            yAxisId="right"
            dataKey="score"
            name="Score"
            fill="#ff7300"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Graph2;
