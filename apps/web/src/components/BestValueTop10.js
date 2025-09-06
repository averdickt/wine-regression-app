import React, { useMemo } from "react";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Scatter
} from "recharts";

export default function BestValueTop10({ rows, selectedProduct, selectedVintage }) {
  const currentYear = new Date().getFullYear();

  const { candidates, region, wineClass, xMin, xMax } = useMemo(() => {
    if (!rows || rows.length === 0 || !selectedProduct || !selectedVintage) {
      return { candidates: [], region: "", wineClass: "", xMin: 0, xMax: 0 };
    }

    const selRow = rows.find(
      r =>
        r.Product === selectedProduct &&
        String(r.Vintage) === String(selectedVintage)
    );
    if (!selRow) return { candidates: [], region: "", wineClass: "", xMin: 0, xMax: 0 };

    const { Region, Wine_Class } = selRow;

    const wines = rows
      .filter(r => r.Region === Region && r.Wine_Class === Wine_Class)
      .map(r => ({
        ...r,
        Vintage: parseInt(r.Vintage),
        DA_Start: parseInt(r.DA_Start),
        DA_Finish: parseInt(r.DA_Finish),
        Label: `${r.Product} ${r.Vintage}`
      }))
      .sort((a, b) => a.PriceValueDiff - b.PriceValueDiff)
      .slice(0, 10);

    const starts = wines.map(w => w.DA_Start || 9999);
    const finishes = wines.map(w => w.DA_Finish || 0);
    const minStart = Math.min(...starts);
    const maxFinish = Math.max(...finishes);

    return {
      candidates: wines,
      region: Region,
      wineClass: Wine_Class,
      xMin: minStart - 3,
      xMax: maxFinish + 3
    };
  }, [rows, selectedProduct, selectedVintage]);

  if (candidates.length === 0) {
    return <p>No comparable wines found.</p>;
  }

  return (
    <div>
      <h2>Top 10 Best Value Wines ({region}, {wineClass})</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table border="1" cellPadding="5" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Region</th>
                <th>Product</th>
                <th>Vintage</th>
                <th>Price</th>
                <th>PriceValueDiff</th>
                <th>Bid_Qty</th>
                <th>Bid_Per_Case</th>
                <th>Spread</th>
                <th>Offer_Per_Case</th>
                <th>Offer_Qty</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((wine, idx) => (
                <tr key={idx}>
                  <td>{wine.Region}</td>
                  <td>{wine.Product}</td>
                  <td>{wine.Vintage}</td>
                  <td>{wine.Price}</td>
                  <td>{wine.PriceValueDiff}</td>
                  <td>{wine.Bid_Qty}</td>
                  <td>{wine.Bid_Per_Case}</td>
                  <td>{wine.Spread}</td>
                  <td>{wine.Offer_Per_Case}</td>
                  <td>{wine.Offer_Qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart
            data={candidates}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 150, bottom: 20 }}
          >
            <XAxis
              type="number"
              domain={[xMin, xMax]}
              label={{ value: "Year", position: "insideBottom", offset: -5 }}
            />
            <YAxis type="category" dataKey="Label" width={250} />
            <Tooltip />

            {/* Bar: dynamic colored drinking window */}
            <Bar
              dataKey="DA_Finish"
              barSize={15}
              isAnimationActive={false}
              shape={(props) => {
                const { y, height, payload, xAxis } = props;
                const start = payload.DA_Start;
                const finish = payload.DA_Finish;
                const xScale = xAxis.scale;

                if (!start || !finish) return null;

                const x1 = xScale(start);
                const x2 = xScale(finish);

                // dynamic color
                let color = "green";
                if (currentYear < start) color = "red";
                else if (currentYear > finish) color = "yellow";

                return (
                  <rect
                    x={x1}
                    y={y}
                    width={x2 - x1}
                    height={height}
                    fill={color}
                    opacity={0.6}
                  />
                );
              }}
            />

            {/* Dot: vintage */}
            <Scatter dataKey="Vintage" fill="black" shape="circle" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
