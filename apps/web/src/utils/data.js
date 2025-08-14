// apps/web/src/utils/data.js

// Example dataset — replace with your processed CSV/Excel import later
// Required fields for all graphs:
// product, year, score, price, DAStart, DAFinish, drinkingYears
const wineData = [
  {
    product: 'Château Margaux',
    year: 2010,
    score: 98,
    price: 450,
    DAStart: '2020-01-01',
    DAFinish: '2040-01-01',
    drinkingYears: 20
  },
  {
    product: 'Château Margaux',
    year: 2015,
    score: 97,
    price: 380,
    DAStart: '2025-01-01',
    DAFinish: '2045-01-01',
    drinkingYears: 20
  },
  {
    product: 'Château Lafite',
    year: 2009,
    score: 99,
    price: 500,
    DAStart: '2019-01-01',
    DAFinish: '2039-01-01',
    drinkingYears: 20
  }
];

export default wineData;
