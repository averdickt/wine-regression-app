import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Line, ResponsiveContainer
} from "recharts";

export default function Graph1({ data, regression, mode, regressionScope }) {
  if (!data || data.length === 0) return <p>No data loaded</p>;

  // pick axis field depending on perCase/perBottle toggle
  const priceField = mode === "perCase" ? "PricePerCase" : "PricePerBottle";

  const minScore = Math.min(...data.map(d => d.Score));
  const maxScore = Math.max(...data.map(d => d.Score));

  const regressionLine =
    regression && regression.equation
      ? [
          { Score: minScore - 3, [priceField]: regression.predict(minScore - 3) },
          { Score: maxScore + 3, [priceField]: regression.predict(maxScore + 3) },
        ]
      : [];

  // choose line color depending on scope
  let lineColor = "black";
  if (regressionScope === "Region") lineColor = "red";
  if (regressionScope === "Wine_Class") lineColor = "blue";

  return (
    <ResponsiveContainer width="100%" height={500}>
      <ScatterChart>
        <CartesianGrid />
        <XAxis
          dataKey="Score"
          type="number"
          domain={[minScore - 3, maxScore + 3]}
          label={{ value: "Score", position: "insideBottom", offset: -5 }}
        />
        <YAxis
          dataKey={priceField}
          type="number"
          label={{
            value: mode === "perCase" ? "Price per Case" : "Price per Bottle",
            angle: -90,
            position: "insideLeft",
          }}
        />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        <Scatter data={data} fill="#8884d8" />
        {regressionLine.length > 0 && (
          <Line
            type="linear"
            data={regressionLine}
            dataKey={priceField}
            stroke={lineColor}
            dot={false}
          />
        )}
      </ScatterChart>
    </ResponsiveContainer>
  );
}
