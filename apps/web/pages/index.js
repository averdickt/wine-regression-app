import React, { useState, useEffect, useCallback } from "react";
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
  const [vintage, setVintage] = useState(2010);
  const [region, setRegion] = useState("Bordeaux");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState("linked"); // "linked" | "all"
  const [colorMode, setColorMode] = useState("default"); // "default" | "alt"

  // --- Color Maps ---
  const colorMaps = {
    default: {
      red: "#D32F2F",
      green: "#4CAF50",
      yellow: "#FFC107",
    },
    alt: {
      red: "#7B1FA2",
      green: "#2196F3",
      yellow: "#FFC107",
    },
  };
  const colorMap = colorMaps[colorMode];

  // --- Handle chart point/bar clicks ---
  const handleSelectPoint = useCallback(
    ({ product: newProduct, vintage: newVintage }) => {
      if (newProduct) {
        setProduct(newProduct);
        if (newVintage) {
          setVintage(Number(newVintage));
        }
      }
    },
    []
  );

  // --- Load default data ---
  useEffect(() => {
    async function fetchDefaultData() {
      try {
        setLoading(true);
        const response = await fetch("/output_regression_results.xlsx");
        if (!response.ok) throw new Error(`Failed to fetch Excel file: ${response.status}`);
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

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

  // --- Compute product/vintage options ---
  const productOptions = [...new Set(rows.map((r) => r.Product))].sort();
  const vintageOptions = [
    ...new Set(rows.filter((r) => r.Product === product).map((r) => r.Vintage)),
  ].sort((a, b) => a - b);

  // --- Update region when product changes ---
  useEffect(() => {
    const filteredData = rows.filter((r) => r.Product === product);
    if (filteredData.length > 0) setRegion(filteredData[0].Region || "");
  }, [product, rows]);

  // --- Loading/Error ---
  if (loading) return <p>Loading wine data...</p>;
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
    <div style={{ display: "flex", flexDirection: "row", width: "100%", minHeight: "100vh", overflowX: "hidden" }}>
      {/* LEFT: Controls + Charts */}
      <div style={{ flex: 3, padding: "20px" }}>
        <h1>Wine Charts</h1>
        <p>
          Default dataset loaded from <code>output_regression_results.xlsx</code>.  
          Upload another file to override:
        </p>
        <input type="file" accept=".xlsx,.csv" onChange={handleFileUpload} />

        {/* Product/Vintage Selectors */}
        <div style={{ marginTop: "20px" }}>
          <AutocompleteBox options={productOptions} value={product} onChange={setProduct} />
          <Dropdown options={vintageOptions} value={vintage} onChange={(v) => setVintage(Number(v))} />
        </div>

        {/* Color Toggle */}
        <div style={{ marginTop: "10px" }}>
          <label>
            <input
              type="checkbox"
              checked={colorMode === "alt"}
              onChange={(e) => setColorMode(e.target.checked ? "alt" : "default")}
            />
            Color-blind friendly mode
          </label>
        </div>

        {/* Charts */}
        <div style={{ marginTop: "40px" }}>
          <h2>Product Regression Chart</h2>
          <ProductRegressionChart
            data={rows.filter((r) => r.Product === product)}
            highlightVintage={vintage}
            onPointClick={handleSelectPoint}
          />
        </div>

        <div style={{ marginTop: "40px" }}>
          <h2>Price/Score by Vintage</h2>
          <PriceScoreVintageChart
            data={rows.filter((r) => r.Product === product)}
            highlightVintage={vintage}
            DA_Start={
              rows.find((r) => r.Product === product && r.Vintage === vintage)?.DA_Start
            }
            DA_Finish={
              rows.find((r) => r.Product === product && r.Vintage === vintage)?.DA_Finish
            }
            colorMap={colorMap}
            onPointClick={handleSelectPoint}
          />
        </div>

        {/* Toggle for BestValue mode */}
        <div style={{ marginTop: "40px" }}>
          <label>
            <input
              type="radio"
              name="mode"
              value="linked"
              checked={mode === "linked"}
              onChange={() => setMode("linked")}
            />
            Top 10 linked to selected Product/Vintage
          </label>
          <br />
          <label>
            <input
              type="radio"
              name="mode"
              value="all"
              checked={mode === "all"}
              onChange={() => setMode("all")}
            />
            Top 10 overall best values
          </label>
        </div>

        {/* BestValue Component */}
        <div style={{ marginTop: "20px" }}>
          <BestValueTop10
            rows={rows}
            selectedProduct={product}
            selectedVintage={vintage}
            mode={mode}
            colorMap={colorMap}
          />
        </div>
      </div>

      {/* RIGHT: Sidebar */}
      <div style={{ flex: 1, minWidth: "250px", maxWidth: "400px", borderLeft: "1px solid #ccc", padding: "20px" }}>
        <WineDetailPanel product={product} vintage={vintage} region={region} />
      </div>
    </div>
  );
}