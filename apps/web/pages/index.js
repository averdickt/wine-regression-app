import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import regression from "regression";
import Graph1 from "../src/components/Graph1";

export default function Home() {
  const [data, setData] = useState([]);
  const [regressionResult, setRegressionResult] = useState(null);
  const [mode, setMode] = useState("perCase"); // toggle between perCase / perBottle

  // ⬇️ recompute regression whenever data or mode changes
  useEffect(() => {
    if (data.length > 1) {
      const points = data.map((d) => [
        d.Score,
        mode === "perCase" ? d.pricePerCase : d.pricePerBottle,
      ]);
      const result = regression.linear(points, { precision: 4 });
      console.log("Regression result:", result);
      setRegressionResult({
        equation: result.equation,
        r2: result.r2,
        points: result.points.map(([x, y]) => ({
          Score: x,
          price: y,
        })),
      });
    } else {
      setRegressionResult(null);
    }
  }, [data, mode]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const wb = XLSX.read(e.target.result, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws);

      console.log("Raw rows from Excel:", rows.length);

      const parsed = rows
        .filter((row) => row.Case_Condition === "Pristine")
        .map((row) => {
          const caseDesc = row["Case Description"] || "";
          const match = caseDesc.match(/^(\d+)/);
          const bottles = match ? parseInt(match[1], 10) : null;

          let pricePerCase = null;
          if (row["Bid per case"] && row["Offer per case"]) {
            pricePerCase =
              (parseFloat(row["Bid per case"]) +
                parseFloat(row["Offer per case"])) /
              2;
          } else if (row["Last Trade Price"]) {
            pricePerCase = parseFloat(row["Last Trade Price"]);
          }

          if (!pricePerCase || !bottles) return null;

          return {
            Vintage: row.Vintage,
            Product: row.Product,
            Score: parseFloat(row.Score),
            pricePerCase,
            pricePerBottle: pricePerCase / bottles,
          };
        })
        .filter(Boolean);

      console.log("Parsed rows:", parsed.length);
      setData(parsed);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Wine Regression App</h1>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

      {data.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <label>
            <input
              type="radio"
              value="perCase"
              checked={mode === "perCase"}
              onChange={() => setMode("perCase")}
            />
            Per Case
          </label>
          <label style={{ marginLeft: 15 }}>
            <input
              type="radio"
              value="perBottle"
              checked={mode === "perBottle"}
              onChange={() => setMode("perBottle")}
            />
            Per Bottle
          </label>

          {regressionResult && (
            <div style={{ marginTop: 15, fontSize: "14px" }}>
              <strong>Regression:</strong>{" "}
              y = {regressionResult.equation[0].toFixed(2)}x +{" "}
              {regressionResult.equation[1].toFixed(2)} &nbsp; (R² ={" "}
              {regressionResult.r2.toFixed(3)})
            </div>
          )}

          <Graph1
            data={data}
            regression={regressionResult}
            mode={mode}
          />
        </div>
      )}
    </div>
  );
}
