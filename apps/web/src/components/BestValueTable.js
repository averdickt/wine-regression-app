import React from "react";

export default function BestValueTable({ data }) {
  if (!data || data.length === 0) {
    return <p>No data available for table.</p>;
  }

  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        marginBottom: "20px",
      }}
    >
      <thead>
        <tr>
          {[
            "Region",
            "Product",
            "Vintage",
            "Price",
            "PriceValueDiff",
            "Bid_Qty",
            "Bid_Per_Bottle",
            "Spread",
            "Offer_Per_Bottle",
            "Offer_Qty",
          ].map((h) => (
            <th
              key={h}
              style={{
                border: "1px solid #ccc",
                padding: "6px",
                background: "#f9f9f9",
              }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((r, i) => {
          const bottles = parseInt(r.Case_Format?.split(" x ")[0], 10) || 12;
          return (
            <tr key={i}>
              <td style={{ border: "1px solid #ccc", padding: "6px" }}>{r.Region}</td>
              <td style={{ border: "1px solid #ccc", padding: "6px" }}>{r.Product}</td>
              <td style={{ border: "1px solid #ccc", padding: "6px" }}>{r.Vintage}</td>
              <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                ${r.Price?.toFixed(2)}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                {Math.round(r.PriceValueDiff)}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "6px" }}>{r.Bid_Qty}</td>
              <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                ${(r.Bid_Per_Case / bottles).toFixed(2)}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                {r.Spread?.toFixed(4)}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                ${(r.Offer_Per_Case / bottles).toFixed(2)}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "6px" }}>{r.Offer_Qty}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
