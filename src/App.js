// src/App.js
import React, { useState, useMemo } from "react";
import Sidebar from "./components/Sidebar";
import Graph1 from "./components/Graph1";
import Graph2 from "./components/Graph2";
import Graph3 from "./components/Graph3";
import { wineData } from "./utils/data";
import "./App.css";

const App = () => {
  // State for filters (dropdowns and checkboxes)
  const [filters, setFilters] = useState({
    wine: "all",
    vintage: "all",
    region: "all",
    score: "all",
    wineClass: "all",
    groupByRegion: false,
    groupByWineClass: false,
  });

  // Memoized filtered data based on dropdown selections
  const filteredData = useMemo(() => {
    let data = wineData;

    // Apply filters from dropdowns
    if (filters.wine !== "all") {
      data = data.filter((d) => d.wine === filters.wine);
    }
    if (filters.vintage !== "all") {
      data = data.filter((d) => d.vintage === Number(filters.vintage));
    }
    if (filters.region !== "all") {
      data = data.filter((d) => d.region === filters.region);
    }
    if (filters.score !== "all") {
      data = data.filter((d) => d.score === Number(filters.score));
    }
    if (filters.wineClass !== "all") {
      data = data.filter((d) => d.wineClass === filters.wineClass);
    }

    // Apply grouping logic for checkboxes (optional aggregation)
    if (filters.groupByRegion && filters.region === "all") {
      // Example: Group by region, averaging price and score
      const grouped = {};
      data.forEach((d) => {
        const key = d.region;
        if (!grouped[key]) {
          grouped[key] = { ...d, count: 1, price: d.price, score: d.score };
        } else {
          grouped[key].price += d.price;
          grouped[key].score += d.score;
          grouped[key].count += 1;
        }
      });
      data = Object.values(grouped).map((d) => ({
        ...d,
        price: d.price / d.count,
        score: d.score / d.count,
      }));
    } else if (filters.groupByWineClass && filters.wineClass === "all") {
      // Example: Group by wine class, averaging price and score
      const grouped = {};
      data.forEach((d) => {
        const key = d.wineClass;
        if (!grouped[key]) {
          grouped[key] = { ...d, count: 1, price: d.price, score: d.score };
        } else {
          grouped[key].price += d.price;
          grouped[key].score += d.score;
          grouped[key].count += 1;
        }
      });
      data = Object.values(grouped).map((d) => ({
        ...d,
        price: d.price / d.count,
        score: d.score / d.count,
      }));
    }

    return data;
  }, [filters]);

  return (
    <div className="app">
      <Sidebar filters={filters} setFilters={setFilters} />
      <div className="content">
        <Graph1 filters={filters} filteredData={filteredData} />
        <Graph2 filters={filters} filteredData={filteredData} />
        <Graph3 filters={filters} filteredData={filteredData} />
      </div>
    </div>
  );
};

export default App;

  
