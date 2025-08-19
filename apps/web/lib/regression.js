import regression from "regression";

export function filterWineData(data, perBottle = true) {
  return data
    .filter(
      (row) =>
        row.Case_Condition === "Pristine" &&
        /75cl$/.test(row["Case_Format"])
    )
    .map((row) => {
      let price = null;
      const bid = parseFloat(row["Bid_Per_Case"]);
      const offer = parseFloat(row["Offer_Per_Case"]);
      const lastTrade = parseFloat(row["Last_Trade_Price"]);

      if (!isNaN(bid) && !isNaN(offer)) {
        price = (bid + offer) / 2;
      } else if (!isNaN(lastTrade)) {
        price = lastTrade;
      }

      // Extract bottle count
      const caseDesc = row["Case_Format"];
      const bottleCount = parseInt(caseDesc.split("x")[0], 10);

      if (price && perBottle && bottleCount > 0) {
        price = price / bottleCount; // per bottle
      }

      return {
        score: parseFloat(row.Score),
        price,
      };
    })
    .filter((row) => row.price !== null && !isNaN(row.price));
}

export function calculateRegression(data) {
  if (!data || data.length === 0) return null;

  const regressionData = data.map((d) => [d.score, d.price]);
  const result = regression.linear(regressionData, { precision: 4 });

  const linePoints = [];
  const scores = regressionData.map((d) => d[0]);
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);

  for (let s = minScore; s <= maxScore; s += 0.5) {
    const [x, y] = result.predict(s);
    linePoints.push({ score: x, price: y });
  }

  return {
    equation: result.equation,
    r2: result.r2,
    points: linePoints,
  };
}
