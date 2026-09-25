import numpy as np
import pandas as pd


def add_indicators(data):

    data = data.copy()

    # --------------------------------
    # Returns
    # --------------------------------

    data["Return"] = (
        data["Close"].pct_change()
    )

    data["Return_3D"] = (
        data["Close"].pct_change(3)
    )

    data["Return_5D"] = (
        data["Close"].pct_change(5)
    )

    data["Return_10D"] = (
        data["Close"].pct_change(10)
    )

    data["Return_20D"] = (
        data["Close"].pct_change(20)
    )

    # --------------------------------
    # Moving averages
    # --------------------------------

    data["SMA10"] = (
        data["Close"].rolling(10).mean()
    )

    data["SMA20"] = (
        data["Close"].rolling(20).mean()
    )

    data["SMA50"] = (
        data["Close"].rolling(50).mean()
    )

    data["SMA100"] = (
        data["Close"].rolling(100).mean()
    )

    data["EMA12"] = (
        data["Close"]
        .ewm(
            span=12,
            adjust=False
        )
        .mean()
    )

    data["EMA26"] = (
        data["Close"]
        .ewm(
            span=26,
            adjust=False
        )
        .mean()
    )

    # --------------------------------
    # Price / moving average ratios
    # --------------------------------

    data["Price_SMA10_Ratio"] = (
        data["Close"] /
        data["SMA10"]
    )

    data["Price_SMA20_Ratio"] = (
        data["Close"] /
        data["SMA20"]
    )

    data["Price_SMA50_Ratio"] = (
        data["Close"] /
        data["SMA50"]
    )

    # --------------------------------
    # MACD
    # --------------------------------

    data["MACD"] = (
        data["EMA12"] -
        data["EMA26"]
    )

    data["MACD_Signal"] = (
        data["MACD"]
        .ewm(
            span=9,
            adjust=False
        )
        .mean()
    )

    data["MACD_Histogram"] = (
        data["MACD"] -
        data["MACD_Signal"]
    )

    # --------------------------------
    # RSI
    # --------------------------------

    delta = data["Close"].diff()

    gain = delta.clip(
        lower=0
    )

    loss = -delta.clip(
        upper=0
    )

    average_gain = (
        gain.rolling(14).mean()
    )

    average_loss = (
        loss.rolling(14).mean()
    )

    rs = (
        average_gain /
        average_loss.replace(
            0,
            np.nan
        )
    )

    data["RSI"] = (
        100 -
        (100 / (1 + rs))
    )

    # --------------------------------
    # Volatility
    # --------------------------------

    data["Volatility10"] = (
        data["Return"]
        .rolling(10)
        .std()
        * np.sqrt(252)
    )

    data["Volatility20"] = (
        data["Return"]
        .rolling(20)
        .std()
        * np.sqrt(252)
    )

    # --------------------------------
    # ATR
    # --------------------------------

    previous_close = (
        data["Close"].shift(1)
    )

    true_range = pd.concat(
        [
            data["High"] -
            data["Low"],

            (
                data["High"] -
                previous_close
            ).abs(),

            (
                data["Low"] -
                previous_close
            ).abs()
        ],
        axis=1
    ).max(axis=1)

    data["ATR14"] = (
        true_range
        .rolling(14)
        .mean()
    )

    data["ATR_Ratio"] = (
        data["ATR14"] /
        data["Close"]
    )

    # --------------------------------
    # Bollinger Bands
    # --------------------------------

    rolling_mean = (
        data["Close"]
        .rolling(20)
        .mean()
    )

    rolling_std = (
        data["Close"]
        .rolling(20)
        .std()
    )

    data["BB_Upper"] = (
        rolling_mean +
        2 * rolling_std
    )

    data["BB_Lower"] = (
        rolling_mean -
        2 * rolling_std
    )

    data["BB_Position"] = (
        (
            data["Close"] -
            data["BB_Lower"]
        )
        /
        (
            data["BB_Upper"] -
            data["BB_Lower"]
        )
    )

    # --------------------------------
    # Momentum
    # --------------------------------

    data["Momentum10"] = (
        data["Close"] /
        data["Close"].shift(10)
    ) - 1

    data["Momentum20"] = (
        data["Close"] /
        data["Close"].shift(20)
    ) - 1

    # --------------------------------
    # Volume
    # --------------------------------

    data["Volume_SMA20"] = (
        data["Volume"]
        .rolling(20)
        .mean()
    )

    data["Volume_Ratio"] = (
        data["Volume"] /
        data["Volume_SMA20"]
    )

    data["Volume_Change"] = (
        data["Volume"].pct_change()
    )

    # --------------------------------
    # Candle ranges
    # --------------------------------

    data["High_Low_Range"] = (
        (
            data["High"] -
            data["Low"]
        )
        /
        data["Close"]
    )

    data["Open_Close_Range"] = (
        (
            data["Close"] -
            data["Open"]
        )
        /
        data["Open"]
    )

    # --------------------------------
    # Cleanup
    # --------------------------------

    data.replace(
        [np.inf, -np.inf],
        np.nan,
        inplace=True
    )

    data.dropna(
        inplace=True
    )

    return data