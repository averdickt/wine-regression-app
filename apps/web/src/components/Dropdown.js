import React from "react";

export default function Dropdown({ options, value, onChange, placeholder }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ padding: "6px", fontSize: "14px" }}
    >
      <option value="">{placeholder || "-- Select an option --"}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}