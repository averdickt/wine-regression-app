import React, { useState, useMemo } from "react";
import BestValueTable from "./BestValueTable";
import BestValueTop10Graph from "./BestValueTop10Graph";

export default function BestValueTop10({ rows, selectedProduct, selectedVintage }) {
  const [mode, setMode] = useState("linked"); // "linked" or "global"

  // --- Compute wines to show ---
  const wines = useMemo(() => {
    let filtered;
    if (mode === "linked") {
      filtered = rows.filter(
        (r) => r.Product === selectedProduct && r.Vintage === selectedVintage
      );
    } else {
      filtered = [...rows].sort((a, b) => a.PriceValueDiff - b.PriceValueDiff).slice(0, 10);
    }

    // transform into stacked bar values
    return filtered.map((w) => {
      const pre = Math.max(0, w.DA_Start - (w.Vintage || 0));
      const drinking = Math.max(0, w.DA_Finish - w.DA_Start);
      const post = 3; // buffer for red
      return { ...w, pre, drinking, post };
    });
  }, [rows, selectedProduct, selectedVintage, mode]);

  return (
    <div style={{ marginTop: "40px" }}>
      <div style={{ marginBottom: "10px" }}>
        <label>
          <input
            type="radio"
            checked={mode === "linked"}
            onChange={() => setMode("linked")}
          />
          Linked to dropdowns
        </label>
        <label style={{ marginLeft: "15px" }}>
          <input
            type="radio"
            checked={mode === "global"}
            onChange={() => setMode("global")}
          />
          Global Top 10
        </label>
      </div>

      <BestValueTable wines={wines} />
      <BestValueTop10Graph wines={wines} />
    </div>
  );
}