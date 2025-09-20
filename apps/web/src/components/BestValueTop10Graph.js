import React, { useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LabelList,
} from "recharts";

export default function BestValueTop10Graph({ data, colorMap = { red: "#D32F2F", green: "#4CAF50", yellow: "#FFC107" } }) {
  if (!data || data.length === 0) {
    return <p>No data to display for Top 10 Best Value Wines.</p>;
  }

  const minDA = Math.min(...data.map((w) => Number(w.DA_Start))) - 3;
  const maxDA = Math.max(...data.map((w) => Number(w.DA_Finish))) + 3;
  const totalRange = maxDA - minDA;

  // convert to stacked offsets so each row becomes [pre, drinking, post]
  const chartData = data.map((d) => {
    const daStart = Number(d.DA_Start);
    const daFinish = Number(d.DA_Finish);
    return {
      Label: d.Label,
      DA_Start: daStart,
      DA_Finish: daFinish,
      pre: Math.max(0, daStart - minDA),
      drink: Math.max(0, daFinish - daStart),
      post: Math.max(0, maxDA - daFinish),
    };
  });

  useEffect(() => {
    console.log("Rendered BestValueTop10Graph - chartData:", chartData);
  }, [chartData]);

  return (
    <div style={{ width: "100%", height: 520 }}>
      <ResponsiveContainer>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 160, bottom: 20 }}
        >
          <XAxis
            type="number"
            domain={[0, totalRange]}
            tickFormatter={(v) => minDA + v}
            label={{ value: "Drinking Window (Years)", position: "insideBottom", offset: -5 }}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            dataKey="Label"
            type="category"
            width={180}
            tick={{ fontSize: 12 }}
          />

          <Tooltip
            formatter={(value, key, props) => {
              if (!props || !props.payload) return [value, key];
              const payload = props.payload;
              if (key === "pre") return [`${payload.DA_Start - minDA} years`, "Pre-drinking"];
              if (key === "drink") return [`${payload.DA_Finish - payload.DA_Start} years`, "Drinking"];
              if (key === "post") return [`${maxDA - payload.DA_Finish} years`, "Post-drinking"];
              return [value, key];
            }}
            labelFormatter={(label, payload) => {
              if (!payload || !payload[0] || !payload[0].payload) return "";
              const p = payload[0].payload;
              return `${p.DA_Start} - ${p.DA_Finish}`;
            }}
          />

          <Legend
            verticalAlign="top"
            payload={[
              { value: "Pre-drinking", type: "square", color: colorMap.red },
              { value: "Drinking", type: "square", color: colorMap.green },
              { value: "Post-drinking", type: "square", color: colorMap.yellow },
            ]}
          />

          <Bar dataKey="pre" stackId="a" fill={colorMap.red} />
          <Bar dataKey="drink" stackId="a" fill={colorMap.green}>
            <LabelList dataKey={(d) => `${d.DA_Start}-${d.DA_Finish}`} position="insideRight" fill="#000" />
          </Bar>
          <Bar dataKey="post" stackId="a" fill={colorMap.yellow} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}