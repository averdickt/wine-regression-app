import React from "react";

export default function AutocompleteBox({ options, value, onChange }) {
  return (
    <input
      type="text"
      list="product-options"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Select product..."
      style={{ width: "300px", padding: "6px" }}
    />
<datalist id="product-options">
      {options.map((opt) => (
        <option key={opt} value={opt} />
  ))
      </datalist>;
}
