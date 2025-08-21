import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import Graph1 from './components/Graph1';
import ScorePriceChart from './components/ScorePriceChart';

// --- Helpers ---
const extractBottleCount = (format) => {
  const match = format?.match(/^(\d+)\s*x/i);
  return match ? parseInt(match[1], 10) : null;
};

const parsePricePerBottle = (row) => {
  const bid = parseFloat(row['Bid_Per_Case']);
  const offer = parseFloat(row['Offer_Per_Case']);
  const lastTrade = parseFloat(row['Last_Trade_Price']);
  const bottles = extractBottleCount(row['Case_Format']);

  if (!bottles) return null;

  let perCase = null;
  if (!isNaN(bid) && !isNaN(offer)) {
    perCase = (bid + offer) / 2;
  } else if (!isNaN(lastTrade)) {
    perCase = lastTrade;
  }

  if (!perCase) return null;

  return perCase / bottles; // normalize to per bottle
};

const isValidRow = (row) => {
  return (
    row['Bottle_Condition']?.toLowerCase() === 'pristine' &&
    typeof row['Case_Format'] === 'string' &&
    row['Case_Format'].trim().toLowerCase().includes('75cl')
  );
};

function App() {
  const [data, setData] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(worksheet);

      const cleaned = rows
        .filter(isValidRow)
        .map((row) => {
          const price = parsePricePerBottle(row);
          const score = parseFloat(row['Score']);
          const vintage = parseInt(row['Vintage'], 10);
          const product = row['Product'];

          if (!price || isNaN(score) || isNaN(vintage)) return null;

          return {
            vintage,
            price,   // per bottle
            score,
            product,
          };
        })
        .filter(Boolean);

      setData(cleaned);

      console.log("Cleaned data:", cleaned);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <h2>Wine Regression App</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

      {data.length > 0 && (
        <>
          <Graph1 data={data} />
          <ScorePriceChart data={data} />
        </>
      )}
    </div>
  );
}

export default App;
