import regression from "regression";
import * as XLSX from "xlsx";

export function parseExcel(file, perBottle = false) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet);

      console.log("Raw rows from excel:", rows.length);

      // 🔑 Adapted to your actual headers
      const parsed = rows
        .filter((row) => row["Case_Condition"] === "Pristine")
        .map((row) => {
          let price = null;

          if (row["Bid_Per_Case"] && row["Offer_Per_Case"]) {
            price =
              (parseFloat(row["Bid_Per_Case"]) +
                parseFloat(row["Offer_Per_Case"])) /
              2;
          } else if (row["Last_Trade_Price"]) {
            price = parseFloat(row["Last_Trade_Price"]);
          }

          if (!price) return null;

          // per bottle calc from Case_Format (e.g. "12x75cl")
          let bottles = 1;
          if (row["Case_Format"]) {
            const match = row["Case_Format"].match(/^(\d+)x/i);
            if (match) bottles = parseInt(match[1], 10);
          }

          const pricePerBottle = price / bottles;

          return {
            Score: row["Score"] ? parseFloat(String(row["Score"]).replace(/[^\d.]/g, "")) : NaN,
            Price: perBottle ? pricePerBottle : price,
            Region: row["Region"] || "",
            Wine_Class: row["Wine_Class"] || "",
            Product: row["Product"] || "",
            Vintage: row["Vintage"] || "",
            };
        })
        .filter((r) => r && !isNaN(r.Score) && !isNaN(r.Price));

console.log("Headers from first row:", Object.keys(rows[0]));
      console.log("Sample parsed rows:");
parsed.slice(0, 5).forEach((r, i) => {
  console.log(`Row ${i + 1}: Score=${r.Score}, Price=${r.Price}, Case_Format=${r.Case_Format}`);
});
      resolve(parsed);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export function runRegression(rows) {
  if (!rows || rows.length === 0) {
    console.warn("No rows to run regression on");
    return null;
  }

  const data = rows
    .map((r) => [r.Score, r.Price])
    .filter((point) => !isNaN(point[0]) && !isNaN(point[1]));

  console.log("Regression input data count:", data.length);

  if (data.length === 0) {
    console.warn("No valid numeric data for regression");
    return null;
  }

  const result = regression.linear(data);
  console.log("Regression result equation:", result.equation);
  return result;
}
