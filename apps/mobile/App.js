// mobile/App.js
import React, { useState, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import Sidebar from "../src/components/Sidebar"; // Reuse or adapt for RN
import Graph1 from "../src/components/Graph1"; // Adapt for RN charts
import Graph2 from "../src/components/Graph2";
import Graph3 from "../src/components/Graph3";
import { wineData } from "../src/utils/data";

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

  const filteredData = useMemo(() => {
    // Same filtering logic as above
    let data = wineData;
    if (filters.wine !== "all") data = data.filter((d) => d.wine === filters.wine);
    if (filters.vintage !== "all") data = data.filter((d) => d.vintage === Number(filters.vintage));
    if (filters.region !== "all") data = data.filter((d) => d.region === filters.region);
    if (filters.score !== "all") data = data.filter((d) => d.score === Number(filters.score));
    if (filters.wineClass !== "all") data = data.filter((d) => d.wineClass === filters.wineClass);

    if (filters.groupByRegion && filters.region === "all") {
      const grouped = {};
      data.forEach((d) => {
        const key = d.region;
        if (!grouped[key]) grouped[key] = { ...d, count: 1, price: d.price, score: d.score };
        else {
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
      const grouped = {};
      data.forEach((d) => {
        const key = d.wineClass;
        if (!grouped[key]) grouped[key] = { ...d, count: 1, price: d.price, score: d.score };
        else {
          grouped[key].price += d.price;
          grouped[key].score += d.score;
          grouped[key].count += 1;
        }
      });
      data = Object.values(grouped).map((d) modelu    return data;
  }, [filters]);

  return (
    <View style={styles.app}>
      <Sidebar filters={filters} setFilters={setFilters} />
      <View style={styles.content}>
        <Graph1 filters={filters} filteredData={filteredData} />
        <Graph2 filters={filters} filteredData={filteredData} />
        <Graph3 filters={filters} filteredData={filteredData} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  app: {
    flexDirection: "row",
    flex: 1,
  },
  content: {
    marginLeft: 250,
    padding: 20,
    flex: 1,
  },
});

export default App;
