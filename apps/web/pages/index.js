import React, { useState } from "react";
import * as XLSX from "xlsx";
import regression from "regression";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Line
} from "recharts";

export default function Home() {
  const [data, setData] = useState([]);
  const [regressionLine, setRegressionLine] = useState([]);

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet);

      // Clean + transform rows
      let cleaned = [];
      rows.forEach((row) => {
        if (row["bottle condition"] !== "Pristine") return;

        // only 75cl cases
        if (!row["case description"]?.endsWith("75cl")) return;

        // price calculation
        let price = null;
        if (row["bid per case"] && row["offer per case"]) {
          price = (row["bid per case"] + row["offer per case"]) / 2;
        } else if (row["last trade price"]) {
          price = row["last trade price"];
        }
        if (!price) return;

        const numBottles = parseInt(row["case description"]);
        const pricePerBottle = price / numBottles;

        if (row["Scores"] && !isNaN(row["Scores"])) {
          cleaned.push({
            x: Number(row["Scores"]), // independent variable
            y: pricePerBottle, // dependent variable
            wine: row["product"],
            vintage: row["vintage"]
          });
        }
      });

      setData(cleaned);

      // Run regression
      if (cleaned.length > 1) {
        const result = regression.linear(cleaned.map(d => [d.x, d.y]));
        const line = [
          { x: Math.min(...cleaned.map(d => d.x)), y: result.predict(Math.min(...cleaned.map(d => d.x)))[1] },
          { x: Math.max(...cleaned.map(d => d.x)), y: result.predict(Math.max(...cleaned.map(d => d.x)))[1] }
        ];
        setRegressionLine(line);
      }
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Wine Regression App</h1>
      <input type="file" accept=".xlsx" onChange={handleFileUpload} />

      {data.length > 0 && (
        <ScatterChart width={800} height={500}>
          <CartesianGrid />
          <XAxis dataKey="x" name="Score" />
          <YAxis dataKey="y" name="Price (£ per bottle)" />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter name="Wines" data={data} fill="#8884d8" />
          {regressionLine.length > 0 && (
            <Line
              type="linear"
              dataKey="y"
              data={regressionLine}
              stroke="#ff7300"
              dot={false}
            />
          )}
        </ScatterChart>
      )}
    </div>
  );
}
