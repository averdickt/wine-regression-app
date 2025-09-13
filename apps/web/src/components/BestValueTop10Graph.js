import React, { useEffect } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  LabelList,
} from "recharts";

export default function BestValueTop10Graph({ data }) {
  if (!data || data.length === 0) {
    return <p>No data to display for Top 10 Best Value Wines.</p>;
  }

  // --- Axis bounds ---
  const minDA = Math.min(...data.map((w) => w.DA_Start)) - 3;
  const maxDA = Math.max(...data.map((w) => w.DA_Finish)) + 3;
  const range = maxDA - minDA;

  // --- Dynamic tick interval ---
  let tickInterval = 1;
  if (range > 80) tickInterval = 10;
  else if (range > 30) tickInterval = 5;
  else if (range > 20) tickInterval = 2;

  const ticks = Array.from(
    { length: Math.floor(range / tickInterval) + 1 },
    (_, i) => minDA + i * tickInterval
  );

  // --- Segment coloring ---
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

  useEffect(() => {
    console.log("Graph Data:", data);
    console.log("X-axis range:", { minDA, maxDA, tickInterval, ticks });
  }, [data, minDA, maxDA, tickInterval]);

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
            domain={[minDA, maxDA]}
            ticks={ticks}
            tickFormatter={(value) => Math.round(value)}
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
          <Bar
            dataKey="DrinkingWindowWidth"
            barSize={20}
            shape={(props) => {
              const { y, height, payload, xAxis } = props;
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