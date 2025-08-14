// src/App.js
import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Graph1 from "./components/Graph1";
import Graph2 from "./components/Graph2";
import Graph3 from "./components/Graph3";
import "./App.css";

const App = () => {
  const [filters, setFilters] = useState({
    wine: "all",
    vintage: "all",
    region: "all",
    score: "all",
    wineClass: "all",
    groupByRegion: false,
    groupByWineClass: false,
  });

  return (
    <div className="app">
      <Sidebar filters={filters} setFilters={setFilters} />
      <div className="content">
        <Graph1 filters={filters} />
        <Graph2 filters={filters} />
        <Graph3 filters={filters} />
      </div>
    </div>
  );
};

export default App;
