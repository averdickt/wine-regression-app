import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Line, Legend, ResponsiveContainer
} from 'recharts';

export default function Graph1({ data, regression, mode }) {
  if (!data || data.length === 0) return null;

  // Get prices depending on mode
  const prices = data.map(d =>
    mode === 'perCase' ? d.pricePerCase : d.pricePerBottle
  ).filter(p => !isNaN(p));

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  // Add padding so axis isn’t glued to points
  const yMin = Math.max(0, minPrice * 0.9);
  const yMax = maxPrice * 1.1;

  // X axis scaling (lowest score - 3)
  const scores = data.map(d => parseFloat(d.Score));
  const minScore = Math.min(...scores) - 3;
  const maxScore = Math.max(...scores) + 1;

  return (
    <ResponsiveContainer width="100%" height={500}>
      <ScatterChart>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="number"
          dataKey="Score"
          domain={[minScore, maxScore]}
          label={{ value: "Score", position: "insideBottomRight", offset: -5 }}
        />
        <YAxis
          type="number"
          domain={[yMin, yMax]}
          label={{
            value: mode === 'perCase' ? "Price per Case" : "Price per Bottle",
            angle: -90,
            position: "insideLeft"
          }}
        />
        <Tooltip />
        <Legend />
        <Scatter
          name={mode === 'perCase' ? "Price per Case" : "Price per Bottle"}
          data={data}
          fill="#8884d8"
          dataKey={mode === 'perCase' ? "pricePerCase" : "pricePerBottle"}
        />
        {regression && (
          <Line
            type="monotone"
            data={regression.points}
            dataKey="price"
            stroke="red"
            dot={false}
            name="Regression Line"
          />
        )}
      </ScatterChart>
    </ResponsiveContainer>
  );
}
