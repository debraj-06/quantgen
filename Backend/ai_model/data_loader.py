import yfinance as yf
import pandas as pd


def get_market_data(
    symbol,
    period="5y",
    interval="1d"
):
    """
    Download the latest available market data
    for the requested stock.
    """

    data = yf.download(
        symbol,
        period=period,
        interval=interval,
        auto_adjust=True,
        progress=False,
        threads=False
    )

    if data.empty:
        raise ValueError(
            f"No market data found for {symbol}"
        )

    # yfinance may return MultiIndex columns
    if isinstance(data.columns, pd.MultiIndex):
        data.columns = data.columns.get_level_values(0)

    required_columns = [
        "Open",
        "High",
        "Low",
        "Close",
        "Volume"
    ]

    missing_columns = [
        column
        for column in required_columns
        if column not in data.columns
    ]

    if missing_columns:
        raise ValueError(
            f"Missing columns for {symbol}: "
            f"{missing_columns}"
        )

    data = data[
        required_columns
    ].copy()

    data.dropna(
        inplace=True
    )

    data.sort_index(
        inplace=True
    )

    return data