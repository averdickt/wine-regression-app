// apps/web/lib/regression.js
import regression from "regression";

export function calculateRegression(data) {
  if (!data || data.length === 0) return [];

  const points = data.map(d => [d.x, d.y]);
  const result = regression.linear(points);

  return result.points.map(([x, y]) => ({ x, y }));
}
