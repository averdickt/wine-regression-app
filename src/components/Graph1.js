import { fitBestRegression } from "../utils/regression";

const regressionData = dataForSelectedWine.map(d => ({
  score: d.Score,
  price: d.Price_to_use
}));

const regressionResult = fitBestRegression(regressionData, selectedScore);

console.log("Regression type:", regressionResult.type);
console.log("R²:", regressionResult.r2);
console.log("Predicted price:", regressionResult.predictedPrice);
