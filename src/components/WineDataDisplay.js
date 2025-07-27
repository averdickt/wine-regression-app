// src/components/WineDataDisplay.js
import React, { useMemo } from "react";
import { calculateRegression, calculatePremiumDiscount } from "../utils/regression";
import "../styles/WineDataDisplay.css";

const WineDataDisplay = ({ filters, filteredData }) => {
  // Only display if a specific vintage is selected
  if (filters.vintage === "all") {
    return null;
  }

  // Find the selected wine based on vintage
  const selectedWine = useMemo(() => {
    return filteredData.find((d) => d.vintage === Number(filters.vintage));
  }, [filteredData, filters.vintage]);

  // Calculate regression for the filtered data
  const regression = useMemo(() => {
    return calculateRegression(filteredData,
