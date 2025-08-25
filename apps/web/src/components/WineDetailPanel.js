import React from "react";
import images from "../../data/images.json";

// Simple similarity function
function stringSimilarity(a, b) {
  if (!a || !b) return 0;
  const aWords = a.toLowerCase().split(/\s+/);
  const bWords = b.toLowerCase().split(/\s+/);
  const intersection = aWords.filter(w => bWords.includes(w)).length;
  return intersection / Math.max(aWords.length, bWords.length);
}

export default function WineDetailPanel({ product, vintage }) {
  if (!product) return null;

  // 1. Try exact match (product or alias)
  const exactMatch = images.find(
    item =>
      item.product.toLowerCase() === product.toLowerCase() ||
      (item.aliases &&
        item.aliases.some(alias => alias.toLowerCase() === product.toLowerCase()))
  );

  let bestMatch = exactMatch;

  // 2. If no exact match, try fuzzy match
  if (!bestMatch) {
    bestMatch = images
      .map(item => {
        const allNames = [item.product, ...(item.aliases || [])];
        const bestScore = Math.max(...allNames.map(name => stringSimilarity(product, name)));
        return { ...item, score: bestScore };
      })
      .sort((a, b) => b.score - a.score)[0];

    if (bestMatch && bestMatch.score < 0.2) {
      bestMatch = null;
    }
  }

  if (!bestMatch) {
    return (
      <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}>
        <h3>Wine Details</h3>
        <p>No details found for {product}</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}>
      <h3>Wine Details</h3>
      <p><strong>Product:</strong> {bestMatch.product}</p>
      {vintage && <p><strong>Vintage:</strong> {vintage}</p>}
      <p><strong>Region:</strong> {bestMatch.region}</p>

      {/* Optional blend */}
      {bestMatch.blend && (
        <p><strong>Blend:</strong> {bestMatch.blend}</p>
      )}

      {/* Optional description */}
      {bestMatch.description && (
        <p><strong>Description:</strong> {bestMatch.description}</p>
      )}

      {/* Optional critics (array of strings or objects) */}
      {bestMatch.critics && bestMatch.critics.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          <strong>Critics:</strong>
          <ul>
            {bestMatch.critics.map((c, i) => (
              <li key={i}>
                {typeof c === "string"
                  ? c
                  : <><em>{c.source}:</em> {c.comment}</>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Images */}
      <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
        {bestMatch.images?.bottle && (
          <img
            src={bestMatch.images.bottle}
            alt={`${bestMatch.product} bottle`}
            style={{ width: "120px", height: "auto" }}
          />
        )}
        {bestMatch.images?.chateau && (
          <img
            src={bestMatch.images.chateau}
            alt={`${bestMatch.product} estate`}
            style={{ width: "180px", height: "auto" }}
          />
        )}
        {bestMatch.images?.region && (
          <img
            src={bestMatch.images.region}
            alt={`${bestMatch.region} map`}
            style={{ width: "180px", height: "auto" }}
          />
        )}
      </div>
    </div>
  );
}
