import React from "react";
import images from "../data/images.json";

export default function WineDetailPanel({ product, vintage, region }) {
  if (!product || !vintage || !region) return null;

  const match = images.find(
    (entry) =>
      entry.product === product &&
      String(entry.vintage) === String(vintage) &&
      entry.region === region
  );

  if (!match) return <div style={{ padding: "10px" }}>No images available.</div>;

  const { bottle, chateau, region: regionImg } = match.images;

  return (
    <div
      style={{
        width: "300px",
        padding: "15px",
        borderLeft: "1px solid #ccc",
        background: "#fafafa",
        overflowY: "auto"
      }}
    >
      <h3>{product} {vintage}</h3>
      <p><b>Region:</b> {region}</p>

      {bottle && (
        <div style={{ marginBottom: "10px" }}>
          <img src={bottle} alt="Bottle" style={{ width: "100%" }} />
        </div>
      )}
      {chateau && (
        <div style={{ marginBottom: "10px" }}>
          <img src={chateau} alt="Château" style={{ width: "100%" }} />
        </div>
      )}
      {regionImg && (
        <div>
          <img src={regionImg} alt="Region" style={{ width: "100%" }} />
        </div>
      )}
    </div>
  );
}
