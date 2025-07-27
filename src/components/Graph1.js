#### 5. Graph 2: Year vs. Price/Score with Drinking Age Overlay (`src/components/Graph2.js`)

```javascript
// src/components/Graph2.js
import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarController, ScatterController, PointElement, BarElement, LinearScale, Title, Tooltip, Legend } from "chart.js";
import { wineData } from "../utils/data";

ChartJS.register(BarController, ScatterController, PointElement, BarElement, LinearScale, Title, Tooltip, Legend);

const Graph2 = ({ filters }) => {
  const filteredData = useMemo(() => {
    let data = wineData;
    if (filters.wine !== "all") data = data.filter((d) => d.wine === filters.wine);
    if (filters.region !== "all") data = data.filter((d) => d.region === filters.region);
    if (filters.wineClass !== "all") data = data.filter((d) => d.wineClass === filters.wineClass);
    return data;
  }, [filters.wine, filters.region, filters.wineClass]);

  const getColor = (vintage, daStart, daFinish) => {
    const currentYear = 2025;
    const age = currentYear - vintage;
    if (age < daStart) {
      // Yellow gradient for too young
      return `hsl(60, 100%, ${50 + (age / daStart) * 25}%)`;
    } else if (age > daFinish) {
      // Red gradient for too old
      return `hsl(0, 100%, ${50 + ((age - daFinish) / 10) * 25}%)`;
    } else {
      // Green gradient for drinkable
      return `hsl(120, 100%, ${50 + ((age - daStart) / (daFinish - daStart)) * 25}%)`;
    }
  };

  const chartData = {
    datasets: [
      {
        type: "bar",
        label: "Price",
        data: filteredData.map((d) => ({ x: d.vintage, y: d.price })),
        backgroundColor: filteredData.map((d) => getColor(d.vintage, d.daStart, d.daFinish)),
        yAxisID: "y",
      },
      {
        type: "scatter",
        label: "Score",
        data: filteredData.map((d) => ({ x: d.vintage, y: d.score })),
        backgroundColor: filteredData.map((d) => getColor(d.vintage, d.daStart, d.daFinish)),
        pointRadius: 5,
        yAxisID: "y1",
      },
    ],
  };

  ```chartjs
  {
    "type": "bar",
    "data": {
      "datasets": [
        {
          "type": "bar",
          "label": "Price",
          "data": ${JSON.stringify(filteredData.map((d) => ({ x: d.vintage, y: d.price })))},
          "backgroundColor": ${JSON.stringify(filteredData.map((d) => getColor(d.vintage, d.daStart, d.daFinish)))},
          "yAxisID": "y"
        },
        {
          "type": "scatter",
          "label": "Score",
          "data": ${JSON.stringify(filteredData.map((d) => ({ x: d.vintage, y: d.score })))},
          "backgroundColor": ${JSON.stringify(filteredData.map((d) => getColor(d.vintage, d.daStart, d.daFinish)))},
          "pointRadius": 5,
          "yAxisID": "y1"
        }
      ]
    },
    "options": {
      "scales": {
        "x": {
          "title": { "display": true, "text": "Vintage" }
        },
        "y": {
          "title": { "display": true, "text": "Price ($)" },
          "position": "left"
        },
        "y1": {
          "title": { "display": true, "text": "Score" },
          "position": "right"
        }
      },
      "plugins": {
        "legend": { "display": true },
        "tooltip": { "enabled": true }
      }
    }
  }
