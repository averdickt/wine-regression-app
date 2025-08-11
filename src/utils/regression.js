import regression from "regression";

/**
 * Fits best regression model for wine price vs score
 * Can filter by product/region or use all wines
 * @param {Array} wineData - Full dataset of {Product, Region, Vintage, Score, Price_to_use}
 * @param {Object} opts - Options for filtering & prediction
 * @param {String|null} opts.product - Product name or null
 * @param {String} opts.region - Region name or "all"
 * @param {Number|null} opts.targetScore - Score to predict price for
 * @returns {Object} { type, predictedPrice, points, premiumAbs, premiumPct }
 */
export function fitBestRegression(wineData, opts = {}) {
  const { product = null, region = "all", targetScore = null } = opts;

  if (!wineData || wineData.length < 2) {
    return { type: null, predictedPrice: null, points: [], premiumAbs: null, premiumPct: null };
  }

  // Filter based on region/product
  const filteredData = wineData.filter(d => {
    return (
      (!product || d.Product === product) &&
      (region === "all" || d.Region === region)
    );
  });

  const regressionInput = filteredData.map(d => ({
    score: Number(d.Score),
    price: Number(d.Price_to_use),
    year: Number(d.Vintage)
  }));

  if (regressionInput.length < 2) {
    return { type: null, predictedPrice: null, points: [], premiumAbs: null, premiumPct: null };
  }

  // Format for regression library
  const formatted = regressionInput.map(d => [d.score, d.price]);

  // Try linear and polynomial
  const linearResult = regression.linear(formatted, { precision: 6 });
  const polyResult = regression.polynomial(formatted, { order: 2, precision: 6 });

  // Pick better (higher R²)
  const chosen = polyResult.r2 > linearResult.r2 ? polyResult : linearResult;
  const type = polyResult.r2 > linearResult.r2 ? "polynomial" : "linear";

  // Predict target score
  let predictedPrice = null;
  let premiumAbs = null;
  let premiumPct = null;
  if (typeof targetScore === "number") {
    predictedPrice = chosen.predict(targetScore)[1];

    // Find the wine with that score (if exists in filtered data)
    const match = regressionInput.find(d => d.score === targetScore);
    if (match) {
      premiumAbs = match.price - predictedPrice;
      premiumPct = (premiumAbs / predictedPrice) * 100;
    }
  }

  // Create smooth regression line points
  const scoreMin = Math.min(...regressionInput.map(p => p.score));
  const scoreMax = Math.max(...regressionInput.map(p => p.score));
  const step = (scoreMax - scoreMin) / 40;

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
    points,
    premiumAbs,
    premiumPct
  };
}
