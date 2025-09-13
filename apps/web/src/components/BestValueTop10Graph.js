import React, { useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
} from "recharts";

export default function BestValueTop10Graph({ data }) {
  if (!data || data.length === 0) {
    return <p>No data to display for Top 10 Best Value Wines.</p>;
  }

  // --- Axis bounds ---
  const minDA = Math.min(...data.map((w) => w.DA_Start)) - 3;
  const maxDA = Math.max(...data.map((w) => w.DA_Finish)) + 3;

  // --- Transform into stacked offsets ---
  const chartData = data.map((d) => {
    return {
      Label: d.Label,
      red: d.DA_Start - minDA, // years before drinking
      green: d.DA_Finish - d.DA_Start, // drinking period
      yellow: maxDA - d.DA_Finish, // years after drinking
      DA_Start: d.DA_Start,
      DA_Finish: d.DA_Finish,
    };
  });

  // --- Debugging ---
  useEffect(() => {
    console.log("Chart Data (offsets):", chartData);
    console.log("X-axis range:", { minDA, maxDA });
  }, [chartData, minDA, maxDA]);

  return (
    <div style={{ width: "100%", height: 550 }}>
      <ResponsiveContainer>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 120, bottom: 20 }}
        >
          <XAxis
            type="number"
            domain={[0, maxDA - minDA]} // axis in offsets
            tickFormatter={(value) => minDA + value} // show real years
            label={{
              value: "Drinking Window (Years)",
              position: "insideBottom",
              offset: -5,
            }}
          />
          <YAxis
            dataKey="Label"
            type="category"
            width={200}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(_, key, props) => {
              if (key === "red") return [`${props.payload.DA_Start - minDA} years`, "Pre-drinking"];
              if (key === "green") return [`${props.payload.DA_Finish - props.payload.DA_Start} years`, "Drinking"];
              if (key === "yellow") return [`${maxDA - props.payload.DA_Finish} years`, "Post-drinking"];
              return _;
            }}
            labelFormatter={(label, payload) =>
              `${payload[0].payload.DA_Start} - ${payload[0].payload.DA_Finish}`
            }
          />
          <Bar dataKey="red" stackId="a" fill="red" />
          <Bar dataKey="green" stackId="a" fill="green">
            <LabelList
              dataKey={(d) => `${d.DA_Start}-${d.DA_Finish}`}
              position="insideRight"
              fill="#000"
            />
          </Bar>
          <Bar dataKey="yellow" stackId="a" fill="yellow" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}