import { useState } from "react";
import Graph1 from "../src/components/Graph1";
import { parseExcel, runRegression } from "../lib/regression";

export default function Home() {
  const [rows, setRows] = useState([]);
  const [regression, setRegression] = useState(null);
  const [mode, setMode] = useState("perCase");

  const [selectedWine, setSelectedWine] = useState("All");
  const [regressionScope, setRegressionScope] = useState("All"); // All | Region | Wine_Class
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const { parsedRows } = await parseExcel(file);
    setRows(parsedRows);
    setRegression(runRegression(parsedRows, mode)); // default regression = All wines
  };

  // lists for dropdowns
  const wines = ["All", ...Array.from(new Set(rows.map(r => r.Product)))];
  const regions = Array.from(new Set(rows.map(r => r.Region)));
  const classes = Array.from(new Set(rows.map(r => r.Wine_Class)));

  // scatter points (filter by selected wine)
  const filteredRows = selectedWine === "All"
    ? rows
    : rows.filter(r => r.Product === selectedWine);

  // regression dataset (depends on scope)
  let regressionRows = rows;
  if (regressionScope === "Region" && selectedRegions.length > 0) {
    regressionRows = rows.filter(r => selectedRegions.includes(r.Region));
  }
  if (regressionScope === "Wine_Class" && selectedClasses.length > 0) {
    regressionRows = rows.filter(r => selectedClasses.includes(r.Wine_Class));
  }

  const updateRegression = () => {
    setRegression(runRegression(regressionRows, mode));
  };

  return (
    <div>
      <h1>Wine Regression App</h1>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

      {/* toggle perCase/perBottle */}
      <div>
        <label>
          <input
            type="radio"
            checked={mode === "perCase"}
            onChange={() => { setMode("perCase"); updateRegression(); }}
          />
          Per Case
        </label>
        <label>
          <input
            type="radio"
            checked={mode === "perBottle"}
            onChange={() => { setMode("perBottle"); updateRegression(); }}
          />
          Per Bottle
        </label>
      </div>

      {/* wine dropdown (scatter filter only) */}
      <div>
        <label>
          Select wine:{" "}
          <select
            value={selectedWine}
            onChange={(e) => setSelectedWine(e.target.value)}
          >
            {wines.map((wine) => (
              <option key={wine} value={wine}>
                {wine}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* regression scope */}
      <div>
        <label>
          Regression Scope:{" "}
          <select
            value={regressionScope}
            onChange={(e) => { setRegressionScope(e.target.value); updateRegression(); }}
          >
            <option value="All">All Wines</option>
            <option value="Region">By Region</option>
            <option value="Wine_Class">By Wine Class</option>
          </select>
        </label>

        {regressionScope === "Region" && (
          <select
            multiple
            value={selectedRegions}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions, o => o.value);
              setSelectedRegions(selected);
              updateRegression();
            }}
          >
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        )}

        {regressionScope === "Wine_Class" && (
          <select
            multiple
            value={selectedClasses}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions, o => o.value);
              setSelectedClasses(selected);
              updateRegression();
            }}
          >
            {classes.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        )}
      </div>

      <Graph1 data={filteredRows} regression={regression} mode={mode} regressionScope={regressionScope} />
    </div>
  );
}
