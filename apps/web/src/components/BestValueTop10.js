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
          pre: Math.max(0, Math.min(r.DA_Finish, 2025) - r.DA_Start),
          drinking: Math.max(0, Math.min(r.DA_Finish, 2025) - Math.max(r.DA_Start, 2025)),
          post: Math.max(0, 2025 - r.DA_Finish),
        }))
        .sort((a, b) => a.PriceValueDiff - b.PriceValueDiff)
        .slice(0, 10);
    } else if (mode === "linked" && selectedWine) {
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
          pre: Math.max(0, Math.min(2025, r.DA_Start) - r.DA_Start),
          drinking: Math.max(0, Math.min(r.DA_Finish, 2025) - Math.max(r.DA_Start, 2025)),
          post: Math.max(0, 2025 - r.DA_Finish),
        }))
        .sort((a, b) => a.PriceValueDiff - b.PriceValueDiff)
        .slice(0, 10);
    }
    return [];
  }, [rows, selectedWine, mode]);

  return (
    <div>
      <h2>Top 10 Best Value Wines</h2>
      <BestValueTable wines={top10} />
      <BestValueTop10Graph wines={top10} />
    </div>
  );
}