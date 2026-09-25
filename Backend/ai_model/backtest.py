import numpy as np


def generate_signals(data, strategy):
    data = data.copy()

    short_window = strategy["short_window"]
    long_window = strategy["long_window"]

    rsi_buy = strategy["rsi_buy"]
    rsi_sell = strategy["rsi_sell"]

    data["ShortMA"] = (
        data["Close"]
        .rolling(short_window)
        .mean()
    )

    data["LongMA"] = (
        data["Close"]
        .rolling(long_window)
        .mean()
    )

    data["Signal"] = 0

    buy_condition = (
        (data["ShortMA"] > data["LongMA"]) &
        (data["RSI"] < rsi_buy)
    )

    sell_condition = (
        (data["ShortMA"] < data["LongMA"]) &
        (data["RSI"] > rsi_sell)
    )

    data.loc[
        buy_condition,
        "Signal"
    ] = 1

    data.loc[
        sell_condition,
        "Signal"
    ] = -1

    return data


def backtest_strategy(
    data,
    strategy,
    transaction_cost=0.001
):
    """
    Backtest a strategy.

    transaction_cost = 0.001
    means 0.1% estimated cost per position change.
    """

    data = generate_signals(
        data,
        strategy
    )

    data["Position"] = (
        data["Signal"]
        .shift(1)
        .fillna(0)
    )

    data["Trade"] = (
        data["Position"]
        .diff()
        .abs()
        .fillna(0)
    )

    data["StrategyReturn"] = (
        data["Position"] *
        data["Return"]
    )

    data["Cost"] = (
        data["Trade"] *
        transaction_cost
    )

    data["NetStrategyReturn"] = (
        data["StrategyReturn"] -
        data["Cost"]
    )

    data["Equity"] = (
        1 +
        data["NetStrategyReturn"]
    ).cumprod()

    total_return = (
        data["Equity"].iloc[-1] - 1
    )

    days = len(data)

    if days > 0:
        annual_return = (
            (1 + total_return)
            ** (252 / days)
        ) - 1
    else:
        annual_return = 0

    volatility = (
        data["NetStrategyReturn"]
        .std()
        * np.sqrt(252)
    )

    if volatility > 0:
        sharpe = (
            annual_return /
            volatility
        )
    else:
        sharpe = 0

    running_max = (
        data["Equity"]
        .cummax()
    )

    drawdown = (
        data["Equity"] /
        running_max
    ) - 1

    max_drawdown = drawdown.min()

    return {
        "total_return": float(
            total_return
        ),

        "annual_return": float(
            annual_return
        ),

        "volatility": float(
            volatility
        ),

        "sharpe": float(
            sharpe
        ),

        "max_drawdown": float(
            max_drawdown
        ),

        "equity": data["Equity"],

        "data": data
    }