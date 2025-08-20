import * as XLSX from "xlsx";
import regression from "regression";

// Parse Excel into rows
export function parseExcel(file, usePerBottle = false) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet);

      const parsed = json
        .filter((row) => row.Case_Condition === "Pristine")
        .map((row) => {
          let price = null;

          if (row["Bid_Per_Case"] && row["Offer_Per_Case"]) {
            price = (row["Bid_Per_Case"] + row["Offer_Per_Case"]) / 2;
          } else if (row["Last_Trade_Price"]) {
            price = row["Last_Trade_Price"];
          }

          if (!price) return null;

          let pricePerBottle = null;
          if (usePerBottle && row["Case_Format"]) {
            const match = row["Case_Format"].match(/^(\d+)\s*x/i);
            if (match) {
              const bottles = parseInt(match[1], 10);
              if (bottles > 0) {
                pricePerBottle = price / bottles;
              }
            }
          }

          return {
            ...row,
            Score: parseFloat(row.Score),
            Price: usePerBottle ? pricePerBottle : price,
            Region: row.Region,
            Wine_Class: row.Wine_Class,
            Product: row.Product,
          };
        })
        .filter((r) => r && !isNaN(r.Score) && !isNaN(r.Price));

      console.log("Parsed rows:", parsed.length);
      resolve(parsed);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

// Run regression
export function runRegression(rows) {
  if (!rows || rows.length === 0) return null;

  const data = rows.map((r) => [r.Score, r.Price]);
  const result = regression.linear(data);

  console.log("Regression result:", result.equation);
  return result;
}
