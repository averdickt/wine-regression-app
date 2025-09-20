import React, { useMemo } from "react";
import BestValueTable from "./BestValueTable";
import BestValueTop10Graph from "./BestValueTop10Graph";

/**
 * Props:
 * - rows: full dataset
 * - selectedProduct, selectedVintage
 * - mode: "linked" | "all"
 * - colorMap: passed from index.js
 */
export default function BestValueTop10({
  rows,
  selectedProduct,
  selectedVintage,
  mode = "linked",
  colorMap = { red: "#D32F2F", green: "#4CAF50", yellow: "#FFC107" },
}) {
  const selectedWine = rows.find(
    (r) => r.Product === selectedProduct && String(r.Vintage) === String(selectedVintage)
  );

  const top10 = useMemo(() => {
    if (!rows || rows.length === 0) return [];

    let pool = rows.filter((r) => r.DA_Start && r.DA_Finish);

    if (mode === "linked") {
      if (!selectedWine) return [];
      const { Score, Region, Wine_Class } = selectedWine;
      pool = pool.filter(
        (r) =>
          r.Score === Score &&
          r.Region === Region &&
          r.Wine_Class === Wine_Class
      );
    }

    const list = pool
      .slice()
      .sort((a, b) => (Number(a.PriceValueDiff) || 0) - (Number(b.PriceValueDiff) || 0))
      .slice(0, 10)
      .map((r) => ({
        ...r,
        Label: `${r.Product} ${r.Vintage}`,
        DrinkingWindowWidth: (Number(r.DA_Finish) || 0) - (Number(r.DA_Start) || 0),
      }));

    return list;
  }, [rows, selectedWine, mode]);

  if (!selectedWine && mode === "linked") {
    return <p>Please pick a product + vintage to show top 10 linked wines.</p>;
  }

  if (top10.length === 0) {
    return <p>No top-10 results found for the selected criteria.</p>;
  }

  return (
    <div style={{ marginTop: 20 }}>
      <h2>Top 10 Best Value Wines</h2>

      <BestValueTable data={top10} />

      <BestValueTop10Graph data={top10} colorMap={colorMap} />
    </div>
  );
}