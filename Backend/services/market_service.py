import yfinance as yf


def get_stock_data(symbol, period="1mo", interval="1d"):
    try:
        ticker = yf.Ticker(symbol)

        data = ticker.history(
            period=period,
            interval=interval
        )

        if data.empty:
            return None

        data = data.reset_index()

        result = []

        for _, row in data.iterrows():

            date_value = row.get(
                "Date",
                row.get("Datetime")
            )

            result.append({
                "date": str(date_value),
                "open": round(float(row["Open"]), 2),
                "high": round(float(row["High"]), 2),
                "low": round(float(row["Low"]), 2),
                "close": round(float(row["Close"]), 2),
                "volume": int(row["Volume"])
            })

        return result

    except Exception as error:
        print("yFinance error:", error)
        return None


def search_stocks(query):
    """
    Search Yahoo Finance for stocks/assets.
    """

    try:
        search = yf.Search(query)

        quotes = search.quotes

        results = []

        for quote in quotes[:10]:

            symbol = quote.get("symbol")

            if not symbol:
                continue

            results.append({
                "symbol": symbol,
                "name": quote.get(
                    "longname",
                    quote.get(
                        "shortname",
                        symbol
                    )
                ),
                "exchange": quote.get(
                    "exchange",
                    ""
                ),
                "type": quote.get(
                    "quoteType",
                    ""
                )
            })

        return results

    except Exception as error:

        print("Stock search error:", error)

        return []