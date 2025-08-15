import React, { useState } from 'react';
import wineData from './utils';
import Graph1 from './components/Graph1';
import Graph2 from './components/Graph2';
import Graph3 from './components/Graph3';
import Graph4 from './components/Graph4';

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedVintage, setSelectedVintage] = useState('');
  const [tickWineClass, setTickWineClass] = useState(false);

  // Unique product list
  const products = [...new Set(wineData.map(w => w.Product))];

  // Vintages filtered by product selection
  const vintages = selectedProduct
    ? [...new Set(wineData.filter(w => w.Product === selectedProduct).map(w => w.Vintage))]
    : [];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Wine Analytics Dashboard</h1>

      {/* Product Selector */}
      <label>
        Select Product:
        <select
          value={selectedProduct}
          onChange={(e) => {
            setSelectedProduct(e.target.value);
            setSelectedVintage(''); // reset vintage on product change
          }}
        >
          <option value="">-- Select --</option>
          {products.map((prod) => (
            <option key={prod} value={prod}>
              {prod}
            </option>
          ))}
        </select>
      </label>

      {/* Vintage Selector */}
      {selectedProduct && (
        <label style={{ marginLeft: '20px' }}>
          Select Vintage:
          <select
            value={selectedVintage}
            onChange={(e) => setSelectedVintage(e.target.value)}
          >
            <option value="">-- Select --</option>
            {vintages.map((vint) => (
              <option key={vint} value={vint}>
                {vint}
              </option>
            ))}
          </select>
        </label>
      )}

      {/* WineClass Filter */}
      <label style={{ marginLeft: '20px' }}>
        <input
          type="checkbox"
          checked={tickWineClass}
          onChange={(e) => setTickWineClass(e.target.checked)}
        />
        Filter by WineClass
      </label>

      {/* Graphs */}
      <div style={{ marginTop: '40px' }}>
        <Graph1
          selectedProduct={selectedProduct}
          selectedVintage={selectedVintage}
          tickWineClass={tickWineClass}
        />
        <hr />
        <Graph2
          selectedProduct={selectedProduct}
          selectedVintage={selectedVintage}
          tickWineClass={tickWineClass}
        />
        <hr />
        <Graph3
          selectedProduct={selectedProduct}
          selectedVintage={selectedVintage}
          tickWineClass={tickWineClass}
        />
        <hr />
        <Graph4
          selectedProduct={selectedProduct}
          selectedVintage={selectedVintage}
          tickWineClass={tickWineClass}
        />
      </div>
    </div>
  );
}
