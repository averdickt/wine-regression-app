import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import AutocompleteBox from "../src/components/AutocompleteBox";
import Dropdown from "../src/components/Dropdown";
import ProductRegressionChart from "../src/components/ProductRegressionChart";
import PriceScoreVintageChart from "../src/components/PriceScoreVintageChart";
import WineDetailPanel from "../src/components/WineDetailPanel"; // new
import BestValueTop10 from "../src/components/BestValueTop10";

export default function Home() {
  const [rows, setRows] = useState([]);
  const [product, setProduct] = useState("Chateau Margaux Premier Cru Classe");
  const [vintage, setVintage] = useState("");
  const [region, setRegion] = useState("");

  // --- AUTOLOAD from public/processed_wine_data.xlsx ---
  useEffect(() => {
    async function fetchDefaultData() {
      try {
        const response = await fetch("/processed_wine_data.xlsx");
        if (!response.ok) {
          console.error("Failed to fetch default Excel file");
          return;
        }
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setRows(jsonData);
      } catch (err) {
        console.error("Error loading default Excel file:", err);
      }
    }
    fetchDefaultData();
  }, []);

  // --- HANDLE MANUAL UPLOAD ---
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target.result, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws);
      setRows(data);
    };
    reader.readAsBinaryString(file);
  };

  const productOptions = [...new Set(rows.map((r) => r.Product))];
  const vintageOptions = [
    ...new Set(rows.filter((r) => r.Product === product).map((r) => r.Vintage)),
  ];

  const filteredData = rows.filter((r) => r.Product === product);

  // whenever product changes, update region
  useEffect(() => {
    if (filteredData.length > 0) {
      setRegion(filteredData[0].Region || "");
    }
  }, [product, filteredData]);

  if (!rows || rows.length === 0) {
    return <p>Loading default wine data...</p>;
  }

  return (
    <div style={{ padding: "20px", display: "flex" }}>
      {/* LEFT SIDE: controls + charts */}
      <div style={{ flex: 1, paddingRight: "20px" }}>
        <h1>Wine Charts</h1>
        <p>
          Default dataset loaded from <code>processed_wine_data.xlsx</code>.  
          Upload another file to override:
        </p>
        <input type="file" accept=".xlsx,.csv" onChange={handleFileUpload} />

        <div style={{ marginTop: "20px" }}>
          <AutocompleteBox options={productOptions} value={product} onChange={setProduct} />
          <Dropdown options={vintageOptions} value={vintage} onChange={setVintage} />
        </div>

        <div style={{ marginTop: "40px" }}>
          <h2>Product Regression Chart</h2>
          <ProductRegressionChart data={filteredData} highlightVintage={vintage} />
        </div>

        <div style={{ marginTop: "40px" }}>
          <h2>Price/Score by Vintage</h2>
          <PriceScoreVintageChart
            data={filteredData}
            highlightVintage={vintage}
            DA_Start={2005}
            DA_Finish={2015}
          />
        </div>
<div style={{ marginTop: "40px" }}>
  <BestValueTop10 rows={rows} selectedProduct={product} selectedVintage={vintage} />
</div>
      </div>

      {/* RIGHT SIDE: detail sidebar */}
      <WineDetailPanel product={product} vintage={vintage} region={region} />
    </div>
  );
}
