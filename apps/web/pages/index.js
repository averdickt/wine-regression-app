import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import AutocompleteBox from "../src/components/AutocompleteBox";
import Dropdown from "../src/components/Dropdown";
import ProductRegressionChart from "../src/components/ProductRegressionChart";
import PriceScoreVintageChart from "../src/components/PriceScoreVintageChart";
import WineDetailPanel from "../src/components/WineDetailPanel";
import BestValueTop10 from "../src/components/BestValueTop10";

export default function Home() {
  const [rows, setRows] = useState([]);
  const [product, setProduct] = useState("Chateau Margaux Premier Cru Classe");
  const [vintage, setVintage] = useState(null); // start empty, auto-set later
  const [region, setRegion] = useState("Bordeaux");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Load default data ---
  useEffect(() => {
    async function fetchDefaultData() {
      try {
        setLoading(true);
        const response = await fetch("/output_regression_results.xlsx");
        if (!response.ok) {
          throw new Error(`Failed to fetch Excel file: ${response.status}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Normalize data
        const normalizedData = jsonData.map((row) => ({
          Region: row.Region || "",
          Product: row.Product || "",
          Vintage: Number(row.Vintage) || 0,
          Wine_Class: row.Wine_Class || "",
          Case_Format: row.Case_Format || "12 x 75cl",
          Bid_Qty: row.Bid_Qty || "",
          Bid_Per_Case: Number(row.Bid_Per_Case) || 0,
          Spread: Number(row.Spread) || 0,
          Offer_Per_Case: Number(row.Offer_Per_Case) || 0,
          Offer_Qty: row.Offer_Qty || "",
          Score: Number(row.Score) || 0,
          DA_Start: Number(row.DA_Start) || 0,
          DA_Finish: Number(row.DA_Finish) || 0,
          Price: Number(row.Price) || 0,
          PriceValueDiff: Number(row.PriceValueDiff) || 0,
        }));

        setRows(normalizedData);
        setLoading(false);
      } catch (err) {
        console.error("Error loading default Excel file:", err);
        setError("Failed to load wine data. Please try uploading a file.");
        setLoading(false);
      }
    }
    fetchDefaultData();
  }, []);

  // --- Handle manual file upload ---
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target.result, { type: "binary" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(ws);

        // Normalize uploaded data
        const normalizedData = data.map((row) => ({
          Region: row.Region || "",
          Product: row.Product || "",
          Vintage: Number(row.Vintage) || 0,
          Wine_Class: row.Wine_Class || "",
          Case_Format: row.Case_Format || "12 x 75cl",
          Bid_Qty: row.Bid_Qty || "",
          Bid_Per_Case: Number(row.Bid_Per_Case) || 0,
          Spread: Number(row.Spread) || 0,
          Offer_Per_Case: Number(row.Offer_Per_Case) || 0,
          Offer_Qty: row.Offer_Qty || "",
          Score: Number(row.Score) || 0,
          DA_Start: Number(row.DA_Start) || 0,
          DA_Finish: Number(row.DA_Finish) || 0,
          Price: Number(row.Price) || 0,
          PriceValueDiff: Number(row.PriceValueDiff) || 0,
        }));

        setRows(normalizedData);
        setError(null);
      } catch (err) {
        console.error("Error processing uploaded file:", err);
        setError("Failed to process uploaded file. Please ensure it’s a valid Excel file.");
      }
    };
    reader.readAsBinaryString(file);
  };

  // --- Compute product and vintage options ---
  const productOptions = [...new Set(rows.map((r) => r.Product))].sort();
  const vintageOptions = [
    ...new Set(rows.filter((r) => r.Product === product).map((r) => r.Vintage)),
  ].sort((a, b) => a - b);

  // --- Auto-select latest vintage when product changes ---
  useEffect(() => {
    if (vintageOptions.length > 0) {
      setVintage(vintageOptions[vintageOptions.length - 1]);
    } else {
      setVintage(null);
    }
  }, [product, rows]); // recalc when product or dataset changes

  // --- Update region when product changes ---
  useEffect(() => {
    const filteredData = rows.filter((r) => r.Product === product);
    if (filteredData.length > 0) {
      setRegion(filteredData[0].Region || "");
    }
  }, [product, rows]);

  // --- Render loading or error states ---
  if (loading) {
    return <p>Loading wine data...</p>;
  }
  if (error) {
    return (
      <div style={{ padding: "20px" }}>
        <p>{error}</p>
        <input type="file" accept=".xlsx,.csv" onChange={handleFileUpload} />
      </div>
    );
  }
  if (!rows || rows.length === 0) {
    return (
      <div style={{ padding: "20px" }}>
        <p>No wine data available. Please upload a file.</p>
        <input type="file" accept=".xlsx,.csv" onChange={handleFileUpload} />
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        minHeight: "100vh",
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      {/* LEFT SIDE: controls + charts + table */}
      <div style={{ flex: 3, padding: "20px", minWidth: 0 }}>
        <h1>Wine Charts</h1>
        <p>
          Default dataset loaded from <code>processed_wine_data.xlsx</code>.  
          Upload another file to override:
        </p>
        <input type="file" accept=".xlsx,.csv" onChange={handleFileUpload} />

        <div style={{ marginTop: "20px" }}>
          <AutocompleteBox
            options={productOptions}
            value={product}
            onChange={setProduct}
          />
          <Dropdown
            options={vintageOptions}
            value={vintage || ""}
            onChange={(value) => setVintage(Number(value))}
          />
        </div>

        <div style={{ marginTop: "40px" }}>
          <h2>Product Regression Chart</h2>
          <ProductRegressionChart
            data={rows.filter((r) => r.Product === product)}
            highlightVintage={vintage}
          />
        </div>

        <div style={{ marginTop: "40px" }}>
          <h2>Price/Score by Vintage</h2>
          <PriceScoreVintageChart
            data={rows.filter((r) => r.Product === product)}
            highlightVintage={vintage}
            DA_Start={2005}
            DA_Finish={2015}
          />
        </div>

        <div style={{ marginTop: "40px" }}>
          <BestValueTop10
            rows={rows}
            selectedProduct={product}
            selectedVintage={vintage}
          />
        </div>
      </div>

      {/* RIGHT SIDE: detail sidebar */}
      <div
        style={{
          flex: 1,
          minWidth: "250px",
          maxWidth: "400px",
          borderLeft: "1px solid #ccc",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <WineDetailPanel product={product} vintage={vintage} region={region} />
      </div>
    </div>
  );
}