// src/components/WineDataDisplay.js
import React, { useMemo } from "react";
import { wineData } from "../utils/data";

const WineDataDisplay = ({ filters }) => {
  const filteredData = useMemo(() => {
    let data = wineData;
    if (filters.wine !== "all") data = data.filter((d) => d.wine === filters.wine);
    if (filters.vintage !== "all") data = data.filter((d) => d.vintage === filters.vintage);
    if (filters.region !== "all") data = data.filter((d) => d.region === filters.region);
    if (filters.score !== "all") data = data.filter((d) => d.score === Number(filters.score));
    if (filters.wineClass !== "all") data = data.filter((d) => d.wineClass === filters.wineClass);
    return data;
  }, [filters]);

  return (
    <div>
      <h3>Wine Data</h3>
      <table>
        <thead>
          <tr>
            <th>Wine</th>
            <th>Vintage</th>
            <th>Region</th>
            <th>Score</th>
            <th>Wine Class</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              <td>{item.wine}</td>
              <td>{item.vintage}</td>
              <td>{item.region}</td>
              <td>{item.score}</td>
              <td>{item.wineClass}</td>
              <td>{item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WineDataDisplay;
