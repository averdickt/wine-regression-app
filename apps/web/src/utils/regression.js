import regression from 'regression';

/**
 * Filters dataset according to your rules:
 * - bottleCondition === 'Pristine'
 * - caseDescription ends in '75cl'
 * - Price = midpoint of bid/offer if both exist, else lastTradePrice, else ignore
 */
export function filterWineData(data) {
  return data
    .filter(row => row.bottleCondition === 'Pristine' && /75cl$/.test(row.caseDescription))
    .map(row => {
      let price = null;
      const bid = parseFloat(row.bidPerCase);
      const offer = parseFloat(row.offerPerCase);
      const lastTrade = parseFloat(row.lastTradePrice);

      if (!isNaN(bid) && !isNaN(offer)) {
        price = (bid + offer) / 2;
      } else if (!isNaN(lastTrade)) {
        price = lastTrade;
      }

      // Extract bottle count from case description (e.g., "6x75cl" → 6)
      const bottleCount = parseInt(row.caseDescription.split('x')[0], 10);
      if (price && bottleCount > 0) {
        price = price / bottleCount;
      }

      return {
        ...row,
        price
      };
    })
    .filter(row => row.price !== null && !isNaN(row.price));
}

/**
 * Generates regression results for Score → Price
 * Returns:
 * - equation: [slope, intercept]
 * - r2: R² value
 * - points: predicted line points for charting
 */
export function calculateRegression(data) {
  if (!data || data.length === 0) return null;

  const regressionData = data.map(d => [parseFloat(d.score), parseFloat(d.price)]);

  const result = regression.linear(regressionData, { precision: 4 });

  const linePoints = [];
  const scores = regressionData.map(d => d[0]);
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);

  for (let s = minScore; s <= maxScore; s += 0.5) {
    const [x, y] = result.predict(s);
    linePoints.push({ score: x, price: y });
  }

  return {
    equation: result.equation,
    r2: result.r2,
    points: linePoints
  };
}
