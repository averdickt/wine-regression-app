"use client";  // ✅ ensures this runs only in the browser

import { useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  ResponsiveContainer,
} from "recharts";

export default function Home() {
  return <h1>Hello from next.js!</h1>
}
