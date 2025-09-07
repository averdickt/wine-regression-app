import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import AutocompleteBox from "../src/components/AutocompleteBox";
import Dropdown from "../src/components/Dropdown";
import ProductRegressionChart from "../src/components/ProductRegressionChart";
import PriceScoreVintageChart from "../src/components/PriceScoreVintageChart";
import WineDetailPanel from "../src/components/WineDetailPanel";
import BestValueTop10Graph from "../src/components/BestValueTop10Graph";

export default function Home() {
  const [rows, setRows] = useState([]);
  const [product, setProduct] = useState("Chateau Margaux Premier Cru Classe");
  const [vintage, setVintage] = useState(2010);
  const [region, setRegion] = useState("Bordeaux");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Load default dataset ---
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

  // --- File upload handler ---
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

  // --- Dropdown options ---
  const productOptions = [...new Set(rows.map((r) => r.Product))].sort();
  const vintageOptions = [
    ...new Set(rows.filter((r) => r.Product === product).map((r) => r.Vintage)),
  ].sort((a, b) => a - b);

  // --- Update region automatically ---
  useEffect(() => {
    const filteredData = rows.filter((r) => r.Product === product);
    if (filteredData.length > 0) {
      setRegion(filteredData[0].Region || "");
    }
  }, [product, rows]);

  // --- Loading / error states ---
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

  // --- Compute Top 10 Best Value Wines for Graph ---
  const selectedRow = rows.find(
    (r) => r.Product === product && r.Vintage === vintage
  );
  const selectedScore = selectedRow?.Score;
  const selectedRegion = selectedRow?.Region;
  const selectedClass = selectedRow?.Wine_Class;

  const top10 = rows
    .filter(
      (r) =>
        r.Region === selectedRegion &&
        r.Wine_Class === selectedClass &&
        r.Score === selectedScore &&
        r.DA_Start &&
        r.DA_Finish
    )
    .map((r) => ({
      ...r,
      Label: `${r.Product} (${r.Vintage})`,
      DrinkingWindowWidth: r.DA_Finish - r.DA_Start,
    }))
    .sort((a, b) => a.PriceValueDiff - b.PriceValueDiff)
    .slice(0, 10);

  const minStart =
    top10.length > 0 ? Math.min(...top10.map((r) => r.DA_Start)) - 3 : 2000;
  const maxFinish =
    top10.length > 0 ? Math.max(...top10.map((r) => r.DA_Finish)) + 3 : 2030;

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
      {/* LEFT SIDE */}
      <div style={{ flex: 3, padding: "20px", minWidth: 0 }}>
        <h1>Wine Charts</h1>
        <p>
          Default dataset loaded from <code>processed_wine_data.xlsx</code>. Upload another file to override:
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
            value={vintage}
            onChange={(value) => setVintage(Number(value))}
          />
        </div>

        {/* Charts */}
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
          <h2>Top 10 Best Value Wines</h2>
          <BestValueTop10Graph
            data={top10}
            minStart={minStart}
            maxFinish={maxFinish}
          />
        </div>
      </div>

      {/* RIGHT SIDE */}
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