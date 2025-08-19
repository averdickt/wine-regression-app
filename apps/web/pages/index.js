// apps/web/pages/index.js
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { filterWineData, calculateRegression } from '../lib/regression';
import Graph1 from '../src/components/Graph1';

export default function Home() {
  const [wineData, setWineData] = useState([]);
  const [regressionResult, setRegressionResult] = useState(null);
  const [perBottle, setPerBottle] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    console.log("raw rows from excel:", rows.length);

    const filtered = filterWineData(rows);
    console.log("parsed rows:", filtered.length);

    setWineData(filtered);

    const regression = calculateRegression(filtered);
    console.log("regression result:", regression);

    setRegressionResult(regression);
  };

  const displayedData = wineData.map(d => ({
    ...d,
    price: perBottle ? d.pricePerBottle : d.pricePerCase
  }));

  const displayedRegression = regressionResult
    ? {
        ...regressionResult,
        points: regressionResult.points.map(p => ({
          score: p.score,
          price: perBottle ? p.pricePerBottle : p.pricePerCase
        }))
      }
    : null;

  return (
    <div style={{ padding: 20 }}>
      <h1>Wine Regression App</h1>

      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

      <div style={{ margin: '20px 0' }}>
        <label>
          <input
            type="checkbox"
            checked={perBottle}
            onChange={() => setPerBottle(!perBottle)}
          />
          Show per bottle (untick for per case)
        </label>
      </div>

      {displayedData.length > 0 && regressionResult && (
        <Graph1 data={displayedData} regression={displayedRegression} />
      )}
    </div>
  );
}
