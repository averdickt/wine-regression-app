const parsePrice = (row) => {
    const bid = parseFloat(row['bid per case']);
    const offer = parseFloat(row['offer per case']);
    const lastTrade = parseFloat(row['last trade price']);

    if (!isNaN(bid) && !isNaN(offer)) {
      return (bid + offer) / 2;
    } else if (!isNaN(lastTrade)) {
      return lastTrade;
    }
    return null;
  };

  const extractBottleCount = (description) => {
    const match = description?.match(/^(\d+)\s*x/i);
    return match ? parseInt(match[1], 10) : null;
  };

  const isValidRow = (row) => {
    return (
      row['bottle condition']?.toLowerCase() === 'pristine' &&
      typeof row['case description'] === 'string' &&
      row['case description'].trim().toLowerCase().endsWith('75cl')
    );
  };
  const handleFileUpload = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    const binaryStr = e.target.result;
    const workbook = XLSX.read(binaryStr, { type: 'binary' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(worksheet);

    const parsed = rows
      .map((row) => {
        const vintage = parseInt(row["Vintage"], 10);
        const price = parseFloat(row["Price_Per_Bottle"]);
        const product = row["Product"];

        if (!isNaN(vintage) && !isNaN(price)) {
          return { vintage, price, product };
        }
        return null;
      })
      .filter(Boolean);

    setChartData(parsed);

    // Regression: price vs vintage
    const regPoints = parsed.map(d => [d.vintage, d.price]);
    const result = regression.linear(regPoints);
    const regLine = parsed.map(d => ({
      vintage: d.vintage,
      price: result.predict(d.vintage)[1]
    }));

    setRegressionData(regLine);

    console.log("Cleaned data parsed:", parsed);
    console.log("Regression line:", regLine);
  };

  reader.readAsBinaryString(file);
  };

  
