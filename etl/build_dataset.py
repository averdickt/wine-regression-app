# etl/build_dataset.py
import pandas as pd
from datetime import datetime, timedelta
import json, gzip, sys

RAW = "raw.csv"
OUT = "dataset.latest.json.gz"
CUTOFF_DAYS = 90

def price_to_use(row, today):
    last_date = pd.to_datetime(row.get("Last_Trade_Date"), errors="coerce")
    bid = row.get("Bid_Per_Case")
    offer = row.get("Offer_Per_Case")
    last = row.get("Last_Trade_Price")

    if pd.notnull(last_date) and (today - last_date.tz_localize(None)).days <= CUTOFF_DAYS and pd.notnull(last):
        return float(last)
    if pd.notnull(bid) and pd.notnull(offer):
        return float(bid + offer) / 2.0
    if pd.notnull(bid):
        return float(bid)
    if pd.notnull(offer):
        return float(offer)
    return None

def main():
    today = pd.Timestamp.utcnow()
    df = pd.read_csv(RAW)

    # normalize types
    for col in ["Vintage","Score","DA Start","DA Finish","Last_Trade_Price","Bid_Per_Case","Offer_Per_Case","Price"]:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    df["Price_to_use"] = df.apply(lambda r: price_to_use(r, today), axis=1)

    # export as compact json
    records = df.to_dict(orient="records")
    payload = json.dumps(records, separators=(",",":")).encode("utf-8")
    with gzip.open(OUT, "wb") as f:
        f.write(payload)
    print(f"Wrote {OUT} ({len(records)} rows)")

if __name__ == "__main__":
    sys.exit(main())
