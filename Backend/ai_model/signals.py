def generate_ga_signal(data, strategy):
    """
    Generate a signal from the optimized Genetic Algorithm
    strategy.
    """

    data = data.copy()

    short_window = strategy[
        "short_window"
    ]

    long_window = strategy[
        "long_window"
    ]

    rsi_buy = strategy[
        "rsi_buy"
    ]

    rsi_sell = strategy[
        "rsi_sell"
    ]

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

    latest = data.iloc[-1]

    short_ma = float(
        latest["ShortMA"]
    )

    long_ma = float(
        latest["LongMA"]
    )

    rsi = float(
        latest["RSI"]
    )

    # -----------------------------------------------------
    # GA signal
    # -----------------------------------------------------

    if (
        short_ma > long_ma
        and rsi < rsi_buy
    ):

        signal = "BUY"

    elif (
        short_ma < long_ma
        and rsi > rsi_sell
    ):

        signal = "SELL"

    else:

        signal = "HOLD"

    return {
        "signal": signal,

        "rsi": rsi,

        "short_ma": short_ma,

        "long_ma": long_ma,
    }


# =========================================================
# COMBINE ML + GA
# =========================================================

def combine_predictions(
    ml_prediction,
    ga_signal,
    risk,
):
    """
    Combine ML and Genetic Algorithm signals.

    ML provides the main directional prediction.

    GA acts as confirmation.

    The system does not require perfect agreement.
    Instead, strong ML evidence can produce a signal,
    while contradictory GA evidence can downgrade it.
    """

    buy_probability = float(
        ml_prediction[
            "buy_probability"
        ]
    )

    hold_probability = float(
        ml_prediction[
            "hold_probability"
        ]
    )

    sell_probability = float(
        ml_prediction[
            "sell_probability"
        ]
    )

    ml_signal = ml_prediction[
        "prediction"
    ]

    # -----------------------------------------------------
    # Risk thresholds
    # -----------------------------------------------------

    thresholds = {

        "low": {
            "buy": 0.55,
            "sell": 0.55,
            "margin": 0.08,
        },

        "medium": {
            "buy": 0.48,
            "sell": 0.48,
            "margin": 0.06,
        },

        "high": {
            "buy": 0.42,
            "sell": 0.42,
            "margin": 0.04,
        },
    }

    settings = thresholds.get(
        risk,
        thresholds["medium"]
    )

    buy_threshold = settings[
        "buy"
    ]

    sell_threshold = settings[
        "sell"
    ]

    margin = settings[
        "margin"
    ]

    # -----------------------------------------------------
    # Probability margins
    # -----------------------------------------------------

    buy_margin = (
        buy_probability
        - hold_probability
    )

    sell_margin = (
        sell_probability
        - hold_probability
    )

    # -----------------------------------------------------
    # BUY decision
    # -----------------------------------------------------

    buy_signal = (
        buy_probability >= buy_threshold
        and buy_margin >= margin
        and buy_probability > sell_probability
    )

    # -----------------------------------------------------
    # SELL decision
    # -----------------------------------------------------

    sell_signal = (
        sell_probability >= sell_threshold
        and sell_margin >= margin
        and sell_probability > buy_probability
    )

    # -----------------------------------------------------
    # GA confirmation
    # -----------------------------------------------------

    if buy_signal:

        if ga_signal["signal"] == "SELL":
            final_signal = "HOLD"

        else:
            final_signal = "BUY"

    elif sell_signal:

        if ga_signal["signal"] == "BUY":
            final_signal = "HOLD"

        else:
            final_signal = "SELL"

    else:

        # If ML is uncertain, HOLD.
        final_signal = "HOLD"

    # -----------------------------------------------------
    # Return
    # -----------------------------------------------------

    return {
        "signal": final_signal,

        "ml_prediction": ml_signal,

        "ml_confidence": float(
            ml_prediction[
                "confidence"
            ]
        ),

        "buy_probability": buy_probability,

        "hold_probability": hold_probability,

        "sell_probability": sell_probability,

        "ga_signal": ga_signal["signal"],

        "risk": risk,
    }