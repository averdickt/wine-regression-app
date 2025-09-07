import React, { useMemo } from "react";
import BestValueTable from "./BestValueTable";
import BestValueChart from "./BestValueChart";

export default function BestValueTop10({ rows, selectedProduct, selectedVintage }) {
  // — Find the selected wine —
  const selectedRow = rows.find(
    (r) => r.Product === selectedProduct && r.Vintage === selectedVintage
  );
  const selectedScore = selectedRow?.Score;
  const region = selectedRow?.Region;
  const wineClass = selectedRow?.Wine_Class;

  // — Filter and sort top 10 wines —
  const top10 = useMemo(() => {
    if (!selectedScore || !region || !wineClass) return [];

    return rows
      .filter(
        (r) =>
          r.Region === region &&
          r.Wine_Class === wineClass &&
          r.Score === selectedScore &&
          r.DA_Start &&
          r.DA_Finish &&
          r.DA_Start >= 1900 &&
          r.DA_Finish >= r.DA_Start
      )
      .map((r) => ({
        ...r,
        Label: `${r.Product} (${r.Vintage})`,
        DrinkingWindowStart: r.DA_Start,
        DrinkingWindowWidth: r.DA_Finish - r.DA_Start,
      }))
      .sort((a, b) => a.PriceValueDiff - b.PriceValueDiff)
      .slice(0, 10);
  }, [rows, selectedScore, region, wineClass]);

  // — Early return if no valid selection —
  if (!selectedScore) {
    return <p>Please select a Product and Vintage with a score.</p>;
  }
  if (top10.length === 0) {
    return (
      <p>
        No matching wines found for Region: {region}, Class: {wineClass}, Score: {selectedScore}.
      </p>
    );
  }

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Top 10 Best Value Wines (Same Region, Class, and Score)</h2>
      <BestValueTable top10={top10} />
      <BestValueChart top10={top10} />
    </div>
  );
}