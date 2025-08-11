import regression from "regression";

/**
 * Fits the best regression model (linear or polynomial) to wine price vs score
 * @param {Array} data - Array of objects with {score, price}
 * @param {Number} targetScore - Score to predict price for
 * @returns {Object} { type, predictedPrice, points }
 */
export function fitBestRegression(data, targetScore) {
  if (!data || data.length < 2) {
    return { type: null, predictedPrice: null, points: [] };
  }

  // Format for regression library
  const formatted = data.map(d => [d.score, d.price]);

  // Try linear
  const linearResult = regression.linear(formatted, { precision: 6 });
  const polyResult = regression.polynomial(formatted, { order: 2, precision: 6 });

  // Pick the better one (higher R²)
  const chosen = polyResult.r2 > linearResult.r2 ? polyResult : linearResult;
  const type = polyResult.r2 > linearResult.r2 ? "polynomial" : "linear";

  // Predict target score
  let predictedPrice = null;
  if (typeof targetScore === "number") {
    predictedPrice = chosen.predict(targetScore)[1];
  }

  // Create smooth regression line points
  const scoreMin = Math.min(...data.map(p => p.score));
  const scoreMax = Math.max(...data.map(p => p.score));
  const step = (scoreMax - scoreMin) / 40; // 40 segments for smoothness

  const points = [];
  for (let s = scoreMin; s <= scoreMax; s += step) {
    points.push({
      score: s,
      price: chosen.predict(s)[1]
    });
  }

  return {
    type,
    predictedPrice,
    points
  };
}
