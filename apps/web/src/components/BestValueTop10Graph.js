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

  // --- Segment coloring ---
  const getSegmentColors = (start, finish) => {
    const segments = [];
    if (currentYear < start) {
      // Not drinkable yet
      segments.push({ start, end: finish, color: "yellow" });
    } else if (currentYear > finish) {
      // Past peak
      segments.push({ start, end: finish, color: "red" });
    } else {
      // Split between not ready + drinkable
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
          margin={{ top: 50, right: 30, left: 160, bottom: 50 }}
        >
          {/* X-Axis = Years */}
          <XAxis
            type="number"
            domain={[minStart, maxFinish]}
            tickFormatter={(value) => value}
            interval={0}
            angle={-45}
            textAnchor="end"
            height={70}
            label={{
              value: "Drinking Window (Years)",
              position: "insideBottom",
              offset: -5,
            }}
          />

          {/* Y-Axis = Wine label (Product + Vintage) */}
          <YAxis
            dataKey="Label"
            type="category"
            width={220}
            tick={{ fontSize: 12 }}
          />

          {/* Tooltip */}
          <Tooltip
            formatter={(_, __, props) => [
              `${props.payload.DA_Start} - ${props.payload.DA_Finish}`,
              "Drinking Window",
            ]}
          />

          {/* Legend */}
          <Legend
            verticalAlign="top"
            height={36}
            payload={[
              { value: "Not Ready", type: "square", color: "yellow" },
              { value: "Optimal", type: "square", color: "green" },
              { value: "Past Peak", type: "square", color: "red" },
            ]}
          />

          {/* Custom horizontal bars */}
          <Bar
            dataKey="DrinkingWindowWidth"
            barSize={20}
            shape={(props) => {
              const { y, height, payload, xAxis } = props;
              if (!payload || !xAxis) return null;

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
            {/* Label showing DA range inside each bar */}
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