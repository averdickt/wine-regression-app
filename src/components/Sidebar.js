// src/components/Sidebar.js
import React from "react";
import { wineData } from "../utils/data";
import "../styles/Sidebar.css";

const Sidebar = ({ filters, setFilters }) => {
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prev) => ({ ...prev, [name]: checked }));
  };

  // Unique values for dropdowns
  const wines = [...new Set(wineData.map((d) => d.wine))];
  const vintages = [...new Set(wineData.map((d) => d.vintage))];
  const regions = [...new Set(wineData.map((d) => d.region))];
  const scores = [...new Set(wineData.map((d) => d.score))];
  const wineClasses = [...new Set(wineData.map((d) => d.wineClass))];

  return (
    <div className="sidebar">
      <h3>Filters</h3>
      <label>
        Wine:
        <select name="wine" value={filters.wine} onChange={handleFilterChange}>
          <option value="all">All</option>
          {wines.map((wine) => (
            <option key={wine} value={wine}>
              {wine}
            </option>
          ))}
        </select>
      </label>
      <label>
        Vintage:
        <select name="vintage" value={filters.vintage} onChange={handleFilterChange}>
          <option value="all">All</option>
          {vintages.map((vintage) => (
            <option key={vintage} value={vintage}>
              {vintage}
            </option>
          ))}
        </select>
      </label>
      <label>
        Region:
        <select name="region" value={filters.region} onChange={handleFilterChange}>
          <option value="all">All</option>
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </label>
      <label>
        Score:
        <select name="score" value={filters.score} onChange={handleFilterChange}>
          <option value="all">All</option>
          {scores.map((score) => (
            <option key={score} value={score}>
              {score}
            </option>
          ))}
        </select>
      </label>
      <label>
        Wine Class:
        <select name="wineClass" value={filters.wineClass} onChange={handleFilterChange}>
          <option value="all">All</option>
          {wineClasses.map((wineClass) => (
            <option key={wineClass} value={wineClass}>
              {wineClass}
            </option>
          ))}
        </select>
      </label>
      <label>
        Group by Region:
        <input
          type="checkbox"
          name="groupByRegion"
          checked={filters.groupByRegion}
          onChange={handleCheckboxChange}
        />
      </label>
      <label>
        Group by Wine Class:
        <input
          type="checkbox"
          name="groupByWineClass"
          checked={filters.groupByWineClass}
          onChange={handleCheckboxChange}
        />
      </label>
    </div>
  );
};

export default Sidebar;
