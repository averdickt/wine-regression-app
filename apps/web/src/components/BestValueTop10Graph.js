import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  LabelList,
} from "recharts";

export default function BestValueTop10Graph({ wines, colorMap }) {
  if (!wines || wines.length === 0) {
    return <p>No data to display for Top 10 Best Value Wines.</p>;
  }

  const minDA = Math.min(...wines.map((w) => w.DA_Start)) - 3;
  const maxDA = Math.max(...wines.map((w) => w.DA_Finish)) + 3;

  const currentYear = new Date().getFullYear();

  // Assign color segments based on start/finish vs today
  const getSegmentColors = (start, finish) => {
    const segs = [];
    if (currentYear < start) {
      segs.push({ start, end: finish, color: colorMap.green });
      segs.unshift({ start: minDA, end: start, color: colorMap.yellow });
      segs.push({ start: finish, end: maxDA, color: colorMap.red });
    } else if (currentYear > finish) {
      segs.push({ start, end: finish, color: colorMap.red });
      segs.unshift({ start: minDA, end: start, color: colorMap.yellow });
      segs.push({ start: finish, end: maxDA, color: colorMap.yellow });
    } else {
      segs.push({ start, end: currentYear, color: colorMap.yellow });
      segs.push({ start: currentYear, end: finish, color: colorMap.green });
      segs.unshift({ start: minDA, end: start, color: colorMap.yellow });
      segs.push({ start: finish, end: maxDA, color: colorMap.yellow });
    }
    return segs;
  };

  return (
    <div style={{ width: "100%", height: 550 }}>
      <ResponsiveContainer>
        <ComposedChart
          layout="vertical"
          data={wines}
          margin={{ top: 20, right: 30, left: 120, bottom: 20 }}
        >
          <XAxis type="number" domain={[minDA, maxDA]} />
          <YAxis dataKey="Product" type="category" width={200} />
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
              const segments = getSegmentColors(payload.DA_Start, payload.DA_Finish);

              return (
                <g>
                  {segments.map((seg, i) => {
                    const segStart = scale(seg.start);
                    const segEnd = scale(seg.end);
                    return (
                      <rect
                        key={i}
                        x={Math.min(segStart, segEnd)}
                        y={y}
                        width={Math.abs(segEnd - segStart)}
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