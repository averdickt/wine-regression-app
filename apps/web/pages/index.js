// apps/web/pages/index.js
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import ProductRegressionChart from "../src/components/ProductRegressionChart";
import PriceScoreVintageChart from "../src/components/PriceScoreVintageChart";

export default function Home() {
  const [data, setData] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const wb = XLSX.read(event.target.result, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(ws);

      // Preprocess: only keep pristine bottles, prices, etc.
      const cleaned = json
        .filter(row => row["Bottle Condition"] === "Pristine")
        .map(row => {
          let price;
          if (row["Bid per case"] && row["Offer per case"]) {
            price = (row["Bid per case"] + row["Offer per case"]) / 2;
          } else {
            price = row["Last Trade Price"];
          }

          const caseDesc = row["Case Description"] || "";
          const match = caseDesc.match(/^(\d+)x/);
          const bottles = match ? parseInt(match[1]) : 1;
          const pricePerBottle = price / bottles;

          return {
            Product: row["Product"],
            Vintage: row["Vintage"],
            Score: row["Score"] || 0,
            Price: pricePerBottle,
          };
        });

      setData(cleaned);
      setProducts([...new Set(cleaned.map(d => d.Product))]);
      setSelectedProduct(cleaned[0]?.Product || "");
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Wine Regression Dashboard</h1>

      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

      {products.length > 0 && (
        <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}>
          {products.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      )}

      {selectedProduct && (
        <>
          <h2>Regression for {selectedProduct}</h2>
          <ProductRegressionChart data={data} product={selectedProduct} />

          <h2>Price vs Score vs Vintage</h2>
          <PriceScoreVintageChart data={data} product={selectedProduct} />
        </>
      )}
    </div>
  );
}
