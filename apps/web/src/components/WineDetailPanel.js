import React from "react";
import images from "../../data/images.json"; // path relative to component

export default function WineDetailPanel({ product, vintage, region }) {
  const entry = images[product] || {};

  return (
    <div
      style={{
        width: "280px",
        padding: "15px",
        borderLeft: "1px solid #ccc",
        background: "#fafafa",
      }}
    >
      <h3>Details</h3>
      <p><strong>Product:</strong> {product}</p>
      {vintage && <p><strong>Vintage:</strong> {vintage}</p>}
      {region && <p><strong>Region:</strong> {region}</p>}

      {entry.bottle && (
        <>
          <h4>Bottle</h4>
          <img src={entry.bottle} alt="Bottle" style={{ width: "100%" }} />
        </>
      )}
      {entry.chateau && (
        <>
          <h4>Château</h4>
          <img src={entry.chateau} alt="Chateau" style={{ width: "100%" }} />
        </>
      )}
      {entry.region && (
        <>
          <h4>Region</h4>
          <img src={entry.region} alt="Region" style={{ width: "100%" }} />
        </>
      )}
    </div>
  );
}
