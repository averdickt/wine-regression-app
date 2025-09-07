import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  LabelList,
  Legend,
  ReferenceLine,
} from "recharts";

export default function BestValueChart({ top10 }) {
  const minStart = Math.min(...top10.map((r) => r.DA_Start)) - 1;
  const maxFinish = Math.max(...top10.map((r) => r.DA_Finish)) + 1;

  const currentYear = new Date().getFullYear();

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
      segments.push({
        start: Math.max(start, currentYear),
        end: finish,
        color: "green",
      });
    }
    return segments;
  };

  return (
    <div style={{ width: "100%", height: 550 }}>
      <ResponsiveContainer>
        <ComposedChart
          layout="vertical"
          data={top10}
          margin={{ top: 20, right: 30, left: 120, bottom: 50 }}
        >
          <XAxis
            type="number"
            domain={[minStart, maxFinish]}
            tickFormatter={(value) => value}
            angle={-45}
            textAnchor="end"
            interval={0}
            label={{
              value: "Drinking Window (Years)",
              position: "insideBottom",
              offset: -5,
            }}
          />
          <YAxis dataKey="Label" type="category" width={200} tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(_, __, props) => [
              `${props.payload.DA_Start} - ${props.payload.DA_Finish}`,
              "Drinking Window",
            ]}
          />
          <Legend
            verticalAlign="top"
            height={36}
            wrapperStyle={{ paddingBottom: "10px" }}
            formatter={(value) => {
              const colorMap = {
                yellow: "Not drinkable",
                green: "Drinkable",
                red: "Past",
              };
              return colorMap[value] || value;
            }}
          />
          <ReferenceLine
            x={currentYear}
            stroke="blue"
            strokeDasharray="3 3"
            label={{
              value: currentYear.toString(),
              position: "top",
              fill: "blue",
              fontSize: 12,
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