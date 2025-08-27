import React, { useState } from "react";
import Tesseract from "tesseract.js";
import stringSimilarity from "string-similarity";

export default function WineScanner({ rows, onResult }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const MIN_SIMILARITY = 0.3; // minimum threshold

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    try {
      const { data: { text } } = await Tesseract.recognize(file, "eng");
      const lines = text.split(/\n/).map(l => l.trim()).filter(Boolean);

      // Build candidates from 1–3 consecutive lines
      const candidates = [];
      for (let i = 0; i < lines.length; i++) {
        candidates.push(lines[i]);
        if (i + 1 < lines.length) {
          candidates.push(lines[i] + " " + lines[i + 1]);
        }
        if (i + 2 < lines.length) {
          candidates.push(lines[i] + " " + lines[i + 1] + " " + lines[i + 2]);
        }
      }

      const productList = [...new Set(rows.map(r => r.Product))];
      let bestMatch = { target: null, rating: 0, product: null };

      candidates.forEach(candidate => {
        const match = stringSimilarity.findBestMatch(candidate, productList);
        if (match.bestMatch.rating > bestMatch.rating) {
          bestMatch = {
            target: candidate,
            rating: match.bestMatch.rating,
            product: match.bestMatch.target,
          };
        }
      });

      // Only accept if above threshold
      const productResult =
        bestMatch.rating >= MIN_SIMILARITY ? bestMatch.product : null;

      // Extract 4-digit vintage
      const vintageMatch = text.match(/\b(19|20)\d{2}\b/);

      const finalResult = {
        product: productResult,
        vintage: vintageMatch ? vintageMatch[0] : null,
        confidence: bestMatch.rating.toFixed(2),
      };

      setResult(finalResult);
      onResult(finalResult);

    } catch (err) {
      console.error("OCR failed:", err);
    }

    setLoading(false);
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Scan Wine Label</h3>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {loading && <p>Scanning...</p>}
      {result && (
        <p>
          📌 <strong>{result.product || "No product found"}</strong>{" "}
          {result.vintage && `(${result.vintage})`} <br />
          🔍 Confidence: {result.confidence}
        </p>
      )}
    </div>
  );
}
