import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  ResponsiveContainer,
} from "recharts";

export default function Graph1({ data, regression, mode }) {
  if (!data || data.length === 0) return null;

  // find min/max score from data
  const scores = data.map((d) => d.Score);
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);

  // extend regression line across domain
  let regressionLine = [];
  if (regression) {
    const [slope, intercept] = regression.equation;
    regressionLine = [
      {
        Score: minScore - 3,
        price: slope * (minScore - 3) + intercept,
      },
      {
        Score: maxScore + 3,
        price: slope * (maxScore + 3) + intercept,
      },
    ];
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart>
        <CartesianGrid />
        <XAxis
          type="number"
          dataKey="Score"
          domain={[minScore - 3, maxScore + 3]}
          label={{ value: "Score", position: "insideBottom", offset: -5 }}
        />
        <YAxis
          type="number"
          dataKey={mode === "perCase" ? "pricePerCase" : "pricePerBottle"}
          label={{
            value: mode === "perCase" ? "Price per Case" : "Price per Bottle",
            angle: -90,
            position: "insideLeft",
          }}
        />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />

        {/* scatter points */}
        <Scatter
          data={data}
          fill="#8884d8"
          shape="circle"
          name="Wines"
        />

        {/* regression line */}
        {regression && (
          <Line
            type="linear"
            dataKey="price"
            data={regressionLine}
            stroke="#ff7300"
            dot={false}
            name="Regression Line"
          />
        )}
      </ScatterChart>
    </ResponsiveContainer>
  );
}
