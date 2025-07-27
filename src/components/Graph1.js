// src/components/Graph1.js
import React, { useMemo } from "react";
import { Scatter } from "react-chartjs-2";
import { Chart as ChartJS, LineController, ScatterController, PointElement, LineElement, LinearScale, Title, Tooltip, Legend } from "chart.js";
import { calculateRegression } from "../utils/regression";
import WineDataDisplay from "./WineDataDisplay";

ChartJS.register(LineController, ScatterController, PointElement, LineElement, LinearScale, Title, Tooltip, Legend);

const Graph1 = ({ filters, filteredData }) => {
  const regression = useMemo(() => calculateRegression(filteredData, "score", "price"), [filteredData]);

  const chartData = {
    datasets: [
      {
        type: "scatter",
        label: "Wines",
        data: filteredData.map((d) => ({ x: d.score, y: d.price })),
        backgroundColor: filteredData.map((d) => `hsl(${(d.vintage % 10) * 36}, 70%, 50%)`),
        pointRadius: 5,
      },
      {
        type: "line",
        label: "Regression Line",
        data: [
          { x: Math.min(...filteredData.map((d) => d.score)), y: regression.slope * Math.min(...filteredData.map((d) => d.score)) + regression.intercept },
          { x: Math.max(...filteredData.map((d) => d.score)), y: regression.slope * Math.max(...filteredData.map((d) => d.score)) + regression.intercept },
        ],
        borderColor: "#ffffff",
        fill: false,
        pointRadius: 0,
      },
    ],
  };

  return (
    <div>
      <h3>Score vs. Price</h3>
      <Scatter
        data={chartData}
        options={{
          scales: {
            x: { title: { display: true, text: "Score" } },
            y: { title: { display: true, text: "Price ($)" } },
          },
        }}
      />
      <WineDataDisplay filters={filters} filteredData={filteredData} />
    </div>
  );
};

export default Graph1;
