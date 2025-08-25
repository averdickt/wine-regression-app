import React from "react";
import {
ScatterChart,
Scatter,
Line,
XAxis,
YAxis,
CartesianGrid,
Tooltip,
ResponsiveContainer,
} from "recharts";
import { bestFitRegression } from "../lib/Regression";

export default function ProductRegressionChart({ data, highlightVintage }) {
if (!data || data.length === 0) return null;

const formattedData = data.map((d) => ({
x: Number(d.Score),     // Score
y: Number(d.Price),     // Price
vintage: d.Vintage,     // Keep vintage
}));

// Calculate regression
const reg = bestFitRegression(formattedData.map((d) => [d.x, d.y]));

// Generate smooth regression line
const xMin = Math.min(...formattedData.map((d) => d.x)) - 1;
const xMax = 100;
const step = (xMax - xMin) / 50;
const linePoints = [];
for (let x = xMin; x <= xMax; x += step) {
const y = reg.predict(x)[1];
linePoints.push({ x, y });
}

return (
<ResponsiveContainer width="100%" height={400}>
<ScatterChart width={600} height={400}>
<CartesianGrid />
<XAxis
type="number"
dataKey="x"
name="Score"
domain={["dataMin - 1", 100]}
/>
<YAxis type="number" dataKey="y" name="Price" />

'''
    {/* Scatter plot points */}
    <Scatter
      name="Products"
      data={formattedData}
      fill="#8884d8"
    />

    {/* Regression line */}
    <Scatter
      name="Regression Line"
      data={linePoints}
      fill="none"
      line={{ stroke: "#ff7300", strokeWidth: 2 }}
      shape={() => null}
    />

    {/* Custom tooltip to include Vintage */}
    <Tooltip
      cursor={{ strokeDasharray: "3 3" }}
      content={({ active, payload }) => {
        if (active && payload && payload.length) {
          const point = payload[0].payload;
          return (
            <div
              style={{
                background: "white",
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              <p>Score: {point.x}</p>
              <p>Price: {point.y}</p>
              {point.vintage && <p>Vintage: {point.vintage}</p>}
            </div>
          );
        }
        return null;
      }}
    />
  </ScatterChart>
</ResponsiveContainer>
'''

);
}
