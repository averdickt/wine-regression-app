import React, { useMemo } from "react";
import BestValueTable from "./BestValueTable";
import BestValueTop10Graph from "./BestValueTop10Graph";

export default function BestValueTop10({ rows, selectedProduct, selectedVintage, mode }) {
  // 1. Find selected wine
  const selectedWine = rows.find(
    (r) => r.Product === selectedProduct && r.Vintage === selectedVintage
  );

  // 2. Compute top 10
  const top10 = useMemo(() => {
    if (!rows || rows.length === 0) return [];

    if (mode === "all") {
      // Global best value top 10
      return rows
        .filter((r) => r.Score && r.DA_Start && r.DA_Finish)
        .map((r) => ({
          ...r,
          Label: `${r.Product} ${r.Vintage}`,
        }))
        .sort((a, b) => a.PriceValueDiff - b.PriceValueDiff)
        .slice(0, 10);
    }

    if (mode === "linked" && selectedWine) {
      // Based on score, region, and class of selected wine
      const { Score, Region, Wine_Class } = selectedWine;
      return rows
        .filter(
          (r) =>
            r.Score === Score &&
            r.Region === Region &&
            r.Wine_Class === Wine_Class &&
            r.DA_Start &&
            r.DA_Finish
        )
        .map((r) => ({
          ...r,
          Label: `${r.Product} ${r.Vintage}`,
        }))
        .sort((a, b) => a.PriceValueDiff - b.PriceValueDiff)
        .slice(0, 10);
    }

    return [];
  }, [rows, selectedWine, mode]);

  return (
    <div>
      <h2>Top 10 Best Value Wines</h2>
      <BestValueTable data={top10} />
      <BestValueTop10Graph data={top10} />
    </div>
  );
}