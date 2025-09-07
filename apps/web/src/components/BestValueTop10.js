import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Legend,
  LabelList,
} from "recharts";

export default function BestValueTop10Graph({ data }) {
  if (!data || data.length === 0) {
    return <p>No drinking window data to display.</p>;
  }

  // Calculate x-axis range
  const minStart = Math.min(...data.map((r) => r.DA_Start)) - 1;
  const maxFinish = Math.max(...data.map((r) => r.DA_Finish)) + 1;

  const currentYear = new Date().getFullYear();

  // Segment coloring function
  const getSegmentColors = (start, finish) => {
    const segments = [];
    if (currentYear < start) {
      segments.push({ start, end: finish, color: "yellow" });
    } else if (currentYear > finish) {
      segments.push({ start, end: finish, color: "red" });
    } else {
      if (start < currentYear) {
        segments.push({ start, end: currentYear, color: "yellow" });
      }
      segments.push({ start: Math.max(start, currentYear), end: finish, color: "green" });
    }
    return segments;
  };

  return (
    <div style={{ width: "100%", height: 500 }}>
      <ResponsiveContainer>
        <ComposedChart
          layout="vertical"
          data={data}
          margin={{ top: 20, right: 30, left: 120, bottom: 20 }}
        >
          <XAxis
            type="number"
            domain={[minStart, maxFinish]}
            tickCount={maxFinish - minStart + 1}
            tickFormatter={(v) => v}
            angle={-45}
            textAnchor="end"
            height={70}
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
            formatter={(_, __, props) => [
              `${props.payload.DA_Start} - ${props.payload.DA_Finish}`,
              "Drinking Window",
            ]}
          />
          <Legend
            verticalAlign="top"
            height={36}
            formatter={(value) => {
              const map = {
                yellow: "Not yet drinkable",
                green: "Drinkable now",
                red: "Past prime",
              };
              return map[value] || value;
            }}
          />

          <Bar
            dataKey="DrinkingWindowWidth"
            barSize={20}
            shape={(props) => {
              const { y, height, payload, xAxis } = props;
              if (!payload || !xAxis?.scale) return null;

              const scale = xAxis.scale;
              const segments = getSegmentColors(payload.DA_Start, payload.DA_Finish);

              return (
                <g>
                  {segments.map((seg, i) => {
                    const segStart = scale(seg.start);
                    const segEnd = scale(seg.end);
                    const rectX = Math.min(segStart, segEnd);
                    const rectWidth = Math.abs(segEnd - segStart);

                    return (
                      <rect
                        key={i}
                        x={rectX}
                        y={y}
                        width={rectWidth}
                        height={height}
                        fill={seg.color}
                      />
                    );
                  })}
                </g>
              );
            }}
          >
            <LabelList
              dataKey={(d) => `${d.DA_Start}-${d.DA_Finish}`}
              position="insideRight"
              fill="#000"
            />
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}