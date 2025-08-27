import React, { useState } from "react";
import Tesseract from "tesseract.js";

// Simple similarity function
function stringSimilarity(a, b) {
  if (!a || !b) return 0;
  const aWords = a.toLowerCase().split(/\s+/);
  const bWords = b.toLowerCase().split(/\s+/);
  const intersection = aWords.filter((w) => bWords.includes(w)).length;
  return intersection / Math.max(aWords.length, bWords.length);
}

export default function WineScanner({ rows, onResult }) {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");

  const handleScan = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const { data: { text: ocrText } } = await Tesseract.recognize(file, "eng");
      setText(ocrText);

      // Extract vintage (4-digit year)
      const vintageMatch = ocrText.match(/\b(19|20)\d{2}\b/);
      const vintage = vintageMatch ? vintageMatch[0] : "";

      // Extract candidate product line
      const lines = ocrText.split("\n").map(l => l.trim()).filter(l => l);
      const candidate = lines.sort((a, b) => b.length - a.length)[0] || "";

      // Try fuzzy match against rows.Product
      let bestMatch = "";
      let bestScore = 0;
      rows.forEach((r) => {
        const score = stringSimilarity(candidate, r.Product);
        if (score > bestScore) {
          bestScore = score;
          bestMatch = r.Product;
        }
      });

      // Require some minimum threshold (e.g. 0.3)
      const finalProduct = bestScore > 0.3 ? bestMatch : candidate;

      // Pass back result
      onResult({ product: finalProduct, vintage });
    } catch (err) {
      console.error("OCR failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <label style={{ display: "block", marginBottom: "10px" }}>
        <strong>Scan Wine Label:</strong>
      </label>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleScan}
      />
      {loading && <p>Scanning label...</p>}
      {text && (
        <div style={{ marginTop: "10px", fontSize: "0.9em", color: "#555" }}>
          <strong>Detected Text:</strong>
          <pre style={{ whiteSpace: "pre-wrap" }}>{text}</pre>
        </div>
      )}
    </div>
  );
}
