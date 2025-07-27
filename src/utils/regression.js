// src/utils/regression.js
export const calculateRegression = (data, xKey, yKey) => {
  const n = data.length;
  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumXX = 0;
  data.forEach((point) => {
    sumX += point[xKey];
    sumY += point[yKey];
    sumXY += point[xKey] * point[yKey];
    sumXX += point[xKey] * point[xKey];
  });
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
};

export const calculatePremiumDiscount = (price, score, regression) => {
  const predictedPrice = regression.slope * score + regression.intercept;
  return ((price - predictedPrice) / predictedPrice * 100).toFixed(2);
};
