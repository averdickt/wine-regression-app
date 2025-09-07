import React, { useMemo } from "react";
import BestValueTop10Graph from "./BestValueTop10Graph";

export default function BestValueTop10({ rows, selectedProduct, selectedVintage }) {
  // --- filter + sort top 10 wines by PriceValueDiff ---
  const top10 = useMemo(() => {
    if (!rows || rows.length === 0) return [];
    return [...rows]
      .filter((r) => r.Score > 0 && r.DA_Start > 0 && r.DA_Finish > 0)
      .sort((a, b) => a.PriceValueDiff - b.PriceValueDiff)
      .slice(0, 10)
      .map((r) => ({
        ...r,
        Label: `${r.Product} (${r.Vintage})`,
        DrinkingWindowWidth: r.DA_Finish - r.DA_Start,
      }));
  }, [rows]);

  // --- determine axis boundaries ---
  const minStart = useMemo(() => {
    return top10.length > 0 ? Math.min(...top10.map((r) => r.DA_Start)) : 2000;
  }, [top10]);

  const maxFinish = useMemo(() => {
    return top10.length > 0 ? Math.max(...top10.map((r) => r.DA_Finish)) : 2035;
  }, [top10]);

  if (!top10 || top10.length === 0) {
    return <p>No data available for Best Value Top 10</p>;
  }

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Best Value Top 10 (Drinking Windows)</h2>
      <BestValueTop10Graph
        data={top10}
        minStart={minStart}
        maxFinish={maxFinish}
      />
    </div>
  );
}