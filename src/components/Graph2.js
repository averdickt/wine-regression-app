import React, { useMemo } from "react";
import {
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Scatter,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

const Graph2 = ({ wineData, selectedProduct }) => {
  const today = new Date();

  // Filter only rows for the selected product
  const filteredData = useMemo(() => {
    return wineData
      .filter(row => row.Product === selectedProduct)
      .map(row => {
        const daStart = new Date(row["DA Start"], 0, 1); // year only
        const daFinish = new Date(row["DA Finish"], 11, 31);

        // Colour gradation logic
        let color;
        if (today > daFinish) {
          const yearsPast = today.getFullYear() - daFinish.getFullYear();
          const intensity = Math.min(1, yearsPast / 10); // cap at 10 years
          color = `rgb(${Math.floor(150 + 105 * intensity)}, 0, 0)`; // dark to bright red
        } else if (today < daStart) {
          const yearsBefore = daStart.getFullYear() - today.getFullYear();
          const intensity = Math.min(1, yearsBefore / 10);
          color = `rgb(${Math.floor(255)}, ${Math.floor(255 * (1 - intensity))}, 0)`; // yellow shades
        } else {
          const totalWindow = daFinish.getFullYear() - daStart.getFullYear();
          const yearsIntoWindow = today.getFullYear() - daStart.getFullYear();
          const progress = yearsIntoWindow / totalWindow;
          color = `rgb(0, ${Math.floor(150 + 105 * progress)}, 0)`; // light green to dark green
        }

        return {
          vintage: row.Vintage,
          price: row["Price_to_use"],
          score: row.Score,
          color
        };
      })
      .sort((a, b) => a.vintage - b.vintage); // ensure ascending year
  }, [wineData, selectedProduct, today]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={filteredData}>
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis dataKey="vintage" label={{ value: "Vintage", position: "insideBottom", offset: -5 }} />
        <YAxis
          yAxisId="left"
          label={{ value: "Price (£)", angle: -90, position: "insideLeft" }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          label={{ value: "Score", angle: 90, position: "insideRight" }}
        />
        <Tooltip />
        <Legend />

        {/* Bar for price */}
        <Bar
          yAxisId="left"
          dataKey="price"
          name="Price"
          barSize={20}
          fill="#8884d8"
          shape={(props) => {
            const { fill, x, y, width, height, payload } = props;
            return (
              <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={payload.color}
              />
            );
          }}
        />

        {/* Scatter for score */}
        <Scatter
          yAxisId="right"
          dataKey="score"
          name="Score"
          fill="#000"
          shape="circle"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default Graph2;
