import React from "react";
import BestValueTable from "./BestValueTable";
import BestValueTop10Graph from "./BestValueTop10Graph";

export default function BestValueTop10({ rows }) {
  return (
    <div>
      <BestValueTable rows={rows} />
      <BestValueTop10Graph rows={rows} />
    </div>
  );
}