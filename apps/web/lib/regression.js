import regression from 'regression';

/**
 * Filters dataset according to your rules:
 * - Case_Condition === 'Pristine'
 * - caseDescription ends in '75cl'
 * - Price = midpoint of bid/offer if both exist, else lastTradePrice, else ignore
 */
export function filterWineData(data) {
  return data
    .filter(row => row.Case_Condition === 'Pristine' && /75cl$/.test(row.Case_Description))
    .map(row => {
      let price = null;
      const bid = parseFloat(row.Bid_per_Case);
      const offer = parseFloat(row.Offer_per_Case);
      const lastTrade = parseFloat(row.Last_Trade_Price);

      if (!isNaN(bid) && !isNaN(offer)) {
        price = (bid + offer) / 2;
      } else if (!isNaN(lastTrade)) {
        price = lastTrade;
      }

      // Extract bottle count (e.g., "6x75cl" → 6)
      const bottleCount = parseInt(row.Case_Description.split('x')[0], 10);

      return {
        ...row,
        pricePerCase: price,
        pricePerBottle: price && bottleCount > 0 ? price / bottleCount : null,
      };
    })
    .filter(row => row.pricePerCase !== null && row.pricePerBottle !== null);
}

/**
 * Generates regression results for Score → Price
 * mode: "perCase" or "perBottle"
 */
export function calculateRegression(data, mode = 'perBottle') {
  if (!data || data.length === 0) return null;

  const regressionData = data.map(d => [
    parseFloat(d.Score),
    mode === 'perCase' ? parseFloat(d.pricePerCase) : parseFloat(d.pricePerBottle),
  ]);

  const result = regression.linear(regressionData, { precision: 4 });

  const linePoints = [];
  const scores = regressionData.map(d => d[0]);
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);

  for (let s = minScore - 3; s <= maxScore + 1; s += 0.5) {
    const [x, y] = result.predict(s);
    linePoints.push({ score: x, price: y });
  }

  return {
    equation: result.equation,
    r2: result.r2,
    points: linePoints,
  };
}
