import { useState } from "react";
import * as XLSX from "xlsx";
import regression from "regression";
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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet);

      // filter rows as per your rules
      const filtered = json
        .filter((row) => row["bottle condition"] === "Pristine")
        .filter((row) => row["case description"]?.endsWith("75cl"))
        .map((row) => {
          const bottles = parseInt(row["case description"]); // number at start
          let price = null;
          if (row["bid per case"] && row["offer per case"]) {
            price = (row["bid per case"] + row["offer per case"]) / 2 / bottles;
          } else if (row["last trade price"]) {
            price = row["last trade price"] / bottles;
          }
          return {
            vintage: row["vintage"],
            score: row["Scores"], // make sure you have this col
            price,
          };
        })
        .filter((row) => row.price && row.score);

      setData(filtered);

      // run regression
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
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

      {data.length > 0 && (
        <ResponsiveContainer width="100%" height={500}>
          <ScatterChart>
            <CartesianGrid />
            <XAxis dataKey="score" type="number" name="Score" />
            <YAxis dataKey="price" type="number" name="Price (per bottle)" />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Scatter data={data} fill="#8884d8" />
            <Line
              type="linear"
              dataKey="y"
              data={regressionLine}
              stroke="red"
              dot={false}
            />
          </ScatterChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
