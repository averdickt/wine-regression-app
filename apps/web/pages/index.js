"use client";  // ✅ ensures this runs only in the browser

import { useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  ResponsiveContainer,
} from "recharts";

export default function Home() {
  const [data, setData] = useState([]);
  const [regressionLine, setRegressionLine] = useState([]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // ✅ Import XLSX + regression only in browser
    const XLSX = await import("xlsx");
    const regression = (await import("regression")).default;

    const reader = new FileReader();
    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet);

      const filtered = json
        .filter((row) => row["bottle condition"] === "Pristine")
        .filter((row) => row["case description"]?.endsWith("75cl"))
        .map((row) => {
          const bottles = parseInt(row["case description"]);
          let price = null;
          if (row["bid per case"] && row["offer per case"]) {
            price = (row["bid per case"] + row["offer per case"]) / 2 / bottles;
          } else if (row["last trade price"]) {
            price = row["last trade price"] / bottles;
          }
          return {
            vintage: row["vintage"],
            score: row["Scores"],
            price,
          };
        })
        .filter((row) => row.price && row.score);

      setData(filtered);

      const points = filtered.map((d) => [Number(d.score), Number(d.price)]);
      const result = regression.linear(points);
      const line = points.map(([x]) => ({
        x,
        y: result.predict(x)[1],
      }));

      setRegressionLine(line);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🍷 Wine Regression App</h1>
      <p>If you see this, rendering works.</p>
    </div>
  );
}
