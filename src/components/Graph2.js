// src/components/Graph2.js
import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarController, BarElement, LinearScale, Title, Tooltip, Legend } from "chart.js";
import { wineData } from "../utils/data";

ChartJS.register(BarController, BarElement, LinearScale, Title, Tooltip, Legend);

const Graph2 = ({ filters }) => {
  if (filters.score === "all") return <div>Please select a score to display this graph.</div>;

  const filteredData = useMemo(() => {
    let data = wineData.filter((d) => d.score === Number(filters.score));
    if (filters.region !== "all") data = data.filter((d) => d.region === filters.region);
    if (filters.wineClass !== "all") data = data.filter((d) => d.wineClass === filters.wineClass);
    return data;
  }, [filters.score, filters.region, filters.wineClass]);

  const regions = [...new Set(wineData.map((d) => d.region))];
  const colorMap = regions.reduce((acc, region, i) => ({
    ...acc,
    [region]: `hsl(${i * 60}, 70%, 50%)`,
  }), {});

  const chartData = {
    labels: filteredData.map((d) => d.wine),
    datasets: [
      {
        label: `Price for Score ${filters.score}`,
        data: filteredData.map((d) => d.price),
        backgroundColor: filteredData.map((d) => colorMap[d.region]),
      },
    ],
  };

  const options = {
    scales: {
      x: {
        title: { display: true, text: "Wine" },
      },
      y: {
        title: { display: true, text: "Price ($)" },
      },
    },
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default Graph2;
