// src/utils/data.js
export const wineData = [
  {
    wine: "Chateau Lafite",
    vintage: 2015,
    region: "Bordeaux",
    score: 95,
    price: 500,
    wineClass: "First Growth",
    daStart: 5, // Drinking age start (years)
    daFinish: 20, // Drinking age finish (years)
    lastTradedPrice: 490,
    bid: 480,
    offer: 510,
  },
  {
    wine: "Chateau Margaux",
    vintage: 2016,
    region: "Bordeaux",
    score: 92,
    price: 450,
    wineClass: "First Growth",
    daStart: 6,
    daFinish: 18,
    lastTradedPrice: 440,
    bid: 430,
    offer: 460,
  },
  // Add more data as needed
];

// Utility to get unique values for dropdowns
export const getUniqueValues = (data, key) =>
  ["all", ...new Set(data.map((item) => item[key]))];
