import { regression } from 'mathjs';

// Shared regression calculation logic (extract this from your web component)
export const calculateRegression = (dataPoints) => {
  try {
    // dataPoints should be array of { x: price, y: score }
    const xValues = dataPoints.map(point => point.x);
    const yValues = dataPoints.map(point => point.y);
    
    const result = regression('linear', xValues, yValues);
    
    return {
      slope: result.slope,
      intercept: result.intercept,
      rSquared: result.r2,
      equation: `y = ${result.slope.toFixed(4)}x + ${result.intercept.toFixed(4)}`,
      predictedValues: xValues.map(x => result.slope * x + result.intercept)
    };
  } catch (error) {
    console.error('Regression calculation failed:', error);
    return null;
  }
};

// Calculate relative value (price/score deviation from regression line)
export const calculateRelativeValue = (price, score, regression) => {
  if (!regression) return null;
  
  const predictedPrice = regression.slope * score + regression.intercept;
  const relativeValue = (predictedPrice - price) / predictedPrice * 100;
  
  return {
    predictedPrice: predictedPrice,
    actualPrice: price,
    relativeValue: relativeValue,
    isUndervalued: relativeValue > 0,
    valueScore: Math.abs(relativeValue)
  };
};