import regression from "regression";

export function bestFitRegression(data) {
  // data format: [[x, y], [x, y], ...]
  const linear = regression.linear(data);
  const polynomial = regression.polynomial(data, { order: 2 });

  // Compare R^2 values
  const betterFit = polynomial.r2 > linear.r2 ? polynomial : linear;

  return betterFit;
}
