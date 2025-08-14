// apps/web/src/utils/regression.js
import regression from 'regression';

export default function calculateRegression(data, type = 'linear') {
  if (!data || data.length < 2) return [];

  const points = data.map(d => [d.score, d.price]);
  const result = regression[type](points);

  // Map back to objects for Recharts Line
  return result.points.map(([x, y]) => ({
    score: x,
    price: y
  }));
}
