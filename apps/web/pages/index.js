import React, { useState } from "react";
import * as XLSX from "xlsx";
import regression from "regression";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line
} from "recharts";

export default function Home() {
  const [rows, setRows] = useState([]);
  const [regLine, setRegLine] = useState([]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(worksheet);

    console.log("📊 Raw rows from Excel:", json.length);

    const parsedRows = json
      .filter((row) => {
        if (row["Case Condition"] !== "Pristine") {
          console.log("⏭️ Skipping row (not pristine):", row);
          return false;
        }
        return true;
      })
      .map((row) => {
        const match = row["Case_Format"]
          ? row["Case_Format"].match(/(\d+)\s*x\s*75cl/i)
          : null;
        const bottles = match ? parseInt(match[1]) : 1;

        let price = null;
        if (row["Bid_Per_Case"] && row["Offer_Per_Case"]) {
          price =
            (Number(row["Bid_Per_Case"]) + Number(row["Offer_Per_Case"])) / 2;
        } else if (row["Last_Trade_Price"]) {
          price = Number(row["Last_Trade_Price"]);
        }

        if (!price) {
          console.log("⏭️ Skipping row (no valid price):", row);
          return null;
        }

        if (!row["Score"]) {
          console.log("⏭️ Skipping row (missing score):", row);
          return null;
        }

        return {
          product: row["Product"],
          vintage: Number(row["Vintage"]),
          score: Number(row["Score"]),
          pricePerBottle: price / bottles,
        };
      })
      .filter((r) => r !== null);

    console.log(`✅ Parsed ${parsedRows.length} valid rows`);

    setRows(parsedRows);

    if (parsedRows.length > 1) {
      const result = regression.linear(
        parsedRows.map((r) => [r.score, r.pricePerBottle])
      );
      const regPoints = parsedRows.map((r) => ({
        x: r.score,
        y: result.predict(r.score)[1],
      }));
      setRegLine(regPoints);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>📈 Wine Regression Chart</h1>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

      {rows.length > 0 && (
        <ScatterChart
          width={800}
          height={500}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid />
          <XAxis
            type="number"
            dataKey="score"
            name="Score"
            domain={["auto", "auto"]}
          />
          <YAxis
            type="number"
            dataKey="pricePerBottle"
            name="Price (£)"
            domain={["auto", "auto"]}
          />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter name="Wines" data={rows} fill="#8884d8" />
          <Line
            type="linear"
            dataKey="y"
            data={regLine}
            dot={false}
            stroke="red"
          />
        </ScatterChart>
      )}
    </div>
  );
}
