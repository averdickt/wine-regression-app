import { useState } from "react";
import * as XLSX from "xlsx";
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
import { filterWineData, calculateRegression } from "../lib/regression";
export default function Home() {
  const [data, setData] = useState([]);
  const [regressionResult, setRegressionResult] = useState(null);
  const [perBottle, setPerBottle] = useState(true);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet);

      console.log("Raw rows from Excel:", json.length);

      // Apply filters + parsing
      const parsed = filterWineData(json, perBottle);
      console.log("Valid parsed rows:", parsed.length);
      setData(parsed);

      // Regression
      const regression = calculateRegression(parsed);
      console.log("Regression result:", regression);
      setRegressionResult(regression);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🍷 Wine Regression App</h1>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

      <div style={{ marginTop: 10 }}>
        <button onClick={() => setPerBottle(!perBottle)}>
          Toggle: {perBottle ? "Per Bottle" : "Per Case"}
        </button>
      </div>

      {data.length > 0 && (
        <ResponsiveContainer width="100%" height={500}>
          <ScatterChart>
            <CartesianGrid />
            <XAxis dataKey="score" type="number" name="Score" />
            <YAxis
              dataKey="price"
              type="number"
              name={`Price (${perBottle ? "per bottle" : "per case"})`}
            />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Scatter data={data} fill="#8884d8" />
            {regressionResult && (
              <Line
                type="linear"
                dataKey="price"
                data={regressionResult.points}
                stroke="red"
                dot={false}
              />
            )}
          </ScatterChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
