import React, { useState } from "react";
import * as XLSX from "xlsx";
import AutocompleteBox from "../src/components/AutocompleteBox";
import Dropdown from "../src/components/Dropdown";
import ProductRegressionChart from "../src/components/ProductRegressionChart";
import PriceScoreVintageChart from "../src/components/PriceScoreVintageChart";

export default function Home() {
  const [rows, setRows] = useState([]);
  const [product, setProduct] = useState("Chateau Margaux Premier Cru Classe");
  const [vintage, setVintage] = useState("");

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

  const productOptions = [...new Set(rows.map(r => r.Product))];
  const vintageOptions = [...new Set(rows.filter(r => r.Product === product).map(r => r.Vintage))];

  const filteredData = rows.filter(r => r.Product === product);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Wine Charts</h1>
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
    </div>
  );
}
