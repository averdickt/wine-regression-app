import React from "react";

export default function BestValueTable({ wines }) {
  if (!wines || wines.length === 0) {
    return <p>No wines available</p>;
  }

  return (
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
      <thead>
        <tr>
          <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Wine</th>
          <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Vintage</th>
          <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Score</th>
          <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Price</th>
          <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Value Diff</th>
          <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>DA Start</th>
          <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>DA Finish</th>
        </tr>
      </thead>
      <tbody>
        {wines.map((wine, idx) => (
          <tr key={idx}>
            <td>{wine.Product}</td>
            <td>{wine.Vintage}</td>
            <td>{wine.Score}</td>
            <td>{wine.Price}</td>
            <td>{wine.PriceValueDiff}</td>
            <td>{wine.DA_Start}</td>
            <td>{wine.DA_Finish}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}