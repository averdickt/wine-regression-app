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
} from "recharts";

export default function BestValueTop10Graph({ data, minStart, maxFinish }) {
  const currentYear = new Date().getFullYear();

  // Segment coloring
  const getSegmentColors = (start, finish) => {
    const segments = [];
    if (currentYear < start) {
      // not yet drinkable
      segments.push({ start, end: finish, color: "yellow" });
    } else if (currentYear > finish) {
      // past window
      segments.push({ start, end: finish, color: "red" });
    } else {
      // mixed
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
          data={data}
          margin={{ top: 20, right: 30, left: 120, bottom: 20 }}
        >
          <XAxis
            type="number"
            domain={[minStart, maxFinish]}
            tickFormatter={(v) => v}
            interval={0}
            ticks={Array.from(
              { length: maxFinish - minStart + 1 },
              (_, i) => minStart + i
            )}
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
            width={220}
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
              const colorMap = {
                yellow: "Not drinkable yet",
                green: "Drinkable",
                red: "Past window",
              };
              return colorMap[value] || value;
            }}
          />
          <Bar
            dataKey="DrinkingWindowWidth"
            barSize={20}
            shape={(props) => {
              const { y, height, payload, x, xAxis } = props;
              if (!payload || !xAxis?.scale) return null;

              const scale = xAxis.scale;
              const segments = getSegmentColors(
                payload.DA_Start,
                payload.DA_Finish
              );

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