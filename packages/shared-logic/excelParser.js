import XLSX from 'xlsx';

// Shared Excel parsing logic
export const parseWineData = (workbook) => {
  try {
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    // Transform to format: [{ name: 'Wine Name', price: 100, score: 95, vintage: 2015 }, ...]
    const wineData = jsonData.map(row => ({
      name: row['Wine Name'] || row['Name'],
      price: parseFloat(row['Price']) || 0,
      score: parseFloat(row['Score']) || 0,
      vintage: parseInt(row['Vintage']) || 0,
      region: row['Region'] || '',
      type: row['Type'] || ''
    })).filter(wine => wine.price > 0 && wine.score > 0);
    
    return wineData;
  } catch (error) {
    console.error('Excel parsing failed:', error);
    return [];
  }
};