import * as regression from "regression";

/**
 * Fits best regression line for Price vs Score
 * Chooses between Linear and Polynomial (degree 2) based on R²
 *
 * @param {Array} data - Array of objects with { score, price }
 * @param {number} targetScore - Score of the wine to check
 * @returns {Object} Regression results
 */
export function fitBestRegression(data, targetScore) {
  if (!data || data.length < 3) {
    return { error: "Not enough data for regression" };
  }

  // Convert to [score, price] pairs
  const points = data.map(d => [d.score, d.price]);

  // Fit Linear Regression
  const linearResult = regression.linear(points, { precision: 4 });
  const linearR2 = calculateR2(points, linearResult.predict);

  // Fit Polynomial (degree 2)
  const polyResult = regression.polynomial(points, { order: 2, precision: 4 });
  const polyR2 = calculateR2(points, polyResult.predict);

  // Choose best model (if poly improves R² by > 0.02, use it)
  let bestModel, type;
  if (polyR2 - linearR2 > 0.02) {
    bestModel = polyResult;
    type = "polynomial";
  } else {
    bestModel = linearResult;
    type = "linear";
  }

  // Predict price for target score
  const predictedPrice = bestModel.predict(targetScore)[1];

  return {
    type,
    equation: bestModel.string, // Human-readable equation
    r2: type === "linear" ? linearR2 : polyR2,
    predictedPrice,
    slope: type === "linear" ? bestModel.equation[0] : null,
    intercept: type === "linear" ? bestModel.equation[1] : null,
    residuals: points.map(([x, y]) => ({
      score: x,
      actual: y,
      predicted: bestModel.predict(x)[1],
      diff: y - bestModel.predict(x)[1]
    }))
  };
}

/**
 * Calculate R² manually (since regression lib's R² is not exposed cleanly)
 */
function calculateR2(points, predictFn) {
  const yVals = points.map(p => p[1]);
  const yMean = yVals.reduce((a, b) => a + b, 0) / yVals.length;
  const ssTot = yVals.reduce((sum, y) => sum + Math.pow(y - yMean, 2), 0);
  const ssRes = points.reduce(
    (sum, [x, y]) => sum + Math.pow(y - predictFn(x)[1], 2),
    0
  );
  return 1 - ssRes / ssTot;
}

