import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import wineData from '../utils/data';

const Graph4 = ({ data }) => {
  const todayYear = new Date().getFullYear();

  // Filter to selected product
  const product = "Chateau Angelus"; // replace with dropdown selection
  const filteredData = data.filter((d) => d.Product === product);

  // Find X-axis bounds
  const minDAStart = Math.min(...filteredData.map((d) => d.DA_Start));
  const maxDAFinish = Math.max(...filteredData.map((d) => d.DA_Finish));

  const chartStartYear = minDAStart - 5;
  const chartEndYear = maxDAFinish + 5;

  // Transform data for stacked bar
  const chartData = filteredData.map((d) => {
    const beforeWindow = Math.max(0, d.DA_Start - d.Vintage);
    const inWindow = Math.max(0, d.DA_Finish - d.DA_Start);
    const afterWindow = Math.max(0, chartEndYear - d.DA_Finish);

    return {
      vintage: d.Vintage,
      beforeWindow,
      inWindow,
      afterWindow,
    };
  });

  // Color functions for gradation
  const yellowGrad = (years) => `rgba(255, ${255 - years * 10}, 0, 1)`; // darker closer to start
  const greenGrad = (years) =>
    `rgba(0, ${200 + Math.min(55, years * 5)}, 0, 1)`; // dark in middle
  const redGrad = (years) => `rgba(${200 + Math.min(55, years * 5)}, 0, 0, 1)`; // darker further away

  return (
    <BarChart
      layout="vertical"
      width={800}
      height={400}
      data={chartData}
      margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        type="number"
        domain={[chartStartYear, chartEndYear]}
        label={{ value: "Drinking Age Years", position: "bottom" }}
      />
      <YAxis dataKey="vintage" type="category" />
      <Tooltip />
      <Legend />
      <Bar
        dataKey="beforeWindow"
        stackId="a"
        fill={yellowGrad(1)}
        name="Before Window"
      />
      <Bar
        dataKey="inWindow"
        stackId="a"
        fill={greenGrad(3)}
        name="In Window"
      />
      <Bar
        dataKey="afterWindow"
        stackId="a"
        fill={redGrad(1)}
        name="After Window"
      />
    </BarChart>
  );
};

export default Graph4;
