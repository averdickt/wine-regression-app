import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import RegressionChart from './RegressionChart'; // if you have this component
import WineScoreBarChart from './WineScoreBarChart'; // <- NEW IMPORT

function App() {
  const [regressionData, setRegressionData] = useState([]);
  const [scoreData, setScoreData] = useState([]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = async (evt) => {
      const bstr = evt.target.result;
      const workbook = XLSX.read(bstr, { type: 'binary' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const cleaned = jsonData
        .filter(row => row['bottle condition'] === 'Pristine')
        .filter(row => String(row['case description']).trim().endsWith('75cl'))
        .map(row => {
          const vintage = row['vintage'];
          const product = row['product'];
          const caseDesc = row['case description'];
          const bid = parseFloat(row['bid per case']);
          const offer = parseFloat(row['offer per case']);
          const lastTrade = parseFloat(row['last trade price']);
          const bottles = parseInt(caseDesc.split('x')[0]);

          let price = null;
          if (!isNaN(bid) && !isNaN(offer)) {
            price = (bid + offer) / 2 / bottles;
          } else if (!isNaN(lastTrade)) {
            price = lastTrade / bottles;
          }

          if (!price || !vintage || !product || isNaN(price)) return null;

          return {
            vintage,
            product,
            price: Math.round(price * 100) / 100,
            score: Math.floor(85 + Math.random() * 10) // dummy score for now
          };
        }).filter(Boolean);

      setRegressionData(cleaned);

      const grouped = {};
      cleaned.forEach(row => {
        const { vintage, price, score } = row;
        if (!grouped[vintage]) {
          grouped[vintage] = { totalPrice: 0, totalScore: 0, count: 0 };
        }
        grouped[vintage].totalPrice += price;
        grouped[vintage].totalScore += score;
        grouped[vintage].count += 1;
      });

      const aggregated = Object.entries(grouped).map(([year, vals]) => ({
        year,
        price: Math.round((vals.totalPrice / vals.count) * 100) / 100,
        score: Math.round((vals.totalScore / vals.count) * 10) / 10
      }));

      setScoreData(aggregated);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <h2>Wine Regression App</h2>
      <input type="file" accept=".xlsx" onChange={handleFileUpload} />

      {/* Render both charts */}
      <RegressionChart data={regressionData} />
      <WineScoreBarChart data={scoreData} />
    </div>
  );
}

export default App;

  
