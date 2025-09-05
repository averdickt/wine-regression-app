import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function toNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function barColor(start, finish) {
  const now = new Date().getFullYear();
  if (!start || !finish) return "#cccccc"; // grey if missing
  if (now < start) return "#d9534f";       // red: not ready yet
  if (now > finish) return "#f0ad4e";      // yellow: past peak
  return "#5cb85c";                        // green: in window
}

{/* --- inside BestValueTop10 return() --- */}
<div style={{ flex: 1, minWidth: 500, height: 420 }}>
  <h3>Drinking Window (Top 10)</h3>
  <ResponsiveContainer width="100%" height={380}>
    <BarChart
      layout="vertical"
      data={top10.map(r => ({
        label: `${r.Product} (${r.Vintage})`,
        start: toNum(r.DA_Start ?? r.DAStart),
        finish: toNum(r.DA_Finish ?? r.DAFinish),
      }))}
      margin={{ top: 10, right: 20, left: 120, bottom: 10 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis type="number" domain={['dataMin - 2', 'dataMax + 2']} />
      <YAxis dataKey="label" type="category" width={150} />
      <Tooltip
        formatter={(val, name, { payload }) =>
          [`${payload.start ?? "?"} – ${payload.finish ?? "?"}`, "Drinking Window"]
        }
      />
      <Bar
        dataKey="finish"
        isAnimationActive={false}
        shape={props => {
          const { x, y, height, payload } = props;
          const start = payload.start;
          const finish = payload.finish;
          if (!start || !finish) return null;
          const barX = props.xScale(start);
          const barWidth = props.xScale(finish) - props.xScale(start);
          return (
            <rect
              x={barX}
              y={y}
              width={barWidth}
              height={height}
              fill={barColor(start, finish)}
            />
          );
        }}
      />
    </BarChart>
  </ResponsiveContainer>
</div>