import numpy as np
import pandas as pd
from datetime import datetime, timezone


try:

    from .data_loader import (
        get_market_data
    )

    from .indicators import (
        add_indicators
    )

    from .ml_model import (
        train_test_predict
    )

    from .genetic_algorithm import (
        optimize_portfolio
    )

    from .portfolio import (
        build_portfolio
    )

except ImportError:

    from data_loader import (
        get_market_data
    )

    from indicators import (
        add_indicators
    )

    from ml_model import (
        train_test_predict
    )

    from genetic_algorithm import (
        optimize_portfolio
    )

    from portfolio import (
        build_portfolio
    )


VALID_RISKS = [
    "low",
    "medium",
    "high"
]


def analyze_stock(
    symbol,
    prediction_days=3
):

    print("\n" + "=" * 70)

    print(
        "ANALYZING:",
        symbol
    )

    print("=" * 70)

    # --------------------------------
    # Download market data
    # --------------------------------

    data = get_market_data(
        symbol,
        period="5y",
        interval="1d"
    )

    print(
        "Historical rows:",
        len(data)
    )

    # --------------------------------
    # Indicators
    # --------------------------------

    data = add_indicators(
        data
    )

    print(
        "Technical indicators calculated."
    )

    # --------------------------------
    # ML
    # --------------------------------

    ml_result = train_test_predict(
        data,
        prediction_days=prediction_days
    )

    print(
        "Latest Price:",
        round(
            ml_result[
                "latest_price"
            ],
            2
        )
    )

    print(
        "Expected 3-Day Return:",
        round(
            ml_result[
                "predicted_return_percent"
            ],
            2
        ),
        "%"
    )

    print(
        "Recent Volatility:",
        round(
            ml_result[
                "recent_volatility_percent"
            ],
            2
        ),
        "%"
    )

    print(
        "Model Agreement:",
        round(
            ml_result[
                "model_agreement_percent"
            ],
            2
        ),
        "%"
    )

    return {

        "symbol":
            symbol,

        "data":
            data,

        "ml":
            ml_result
    }


def analyze_portfolio(
    symbols,
    investment_amount,
    risk="medium",
    prediction_days=3
):

    # --------------------------------
    # Validate
    # --------------------------------

    if not symbols:

        raise ValueError(
            "At least one stock "
            "must be selected."
        )

    if investment_amount <= 0:

        raise ValueError(
            "Investment amount must "
            "be greater than 0."
        )

    if risk not in VALID_RISKS:

        raise ValueError(
            "Risk must be low, "
            "medium, or high."
        )

    # Remove duplicates
    symbols = list(
        dict.fromkeys(
            symbols
        )
    )

    results = []

    failed_stocks = []

    # --------------------------------
    # Analyze selected stocks
    # --------------------------------

    for symbol in symbols:

        try:

            result = analyze_stock(
                symbol,
                prediction_days
            )

            results.append(
                result
            )

        except Exception as error:

            print(
                f"Error analyzing "
                f"{symbol}: {error}"
            )

            failed_stocks.append({
                "symbol":
                    symbol,
                "error":
                    str(error)
            })

    if not results:

        raise ValueError(
            "None of the selected "
            "stocks could be analyzed."
        )

    valid_symbols = [
        result["symbol"]
        for result in results
    ]

    # --------------------------------
    # ML predictions
    # --------------------------------

    predictions = {}

    for result in results:

        predictions[
            result["symbol"]
        ] = result["ml"]

    # --------------------------------
    # Daily returns
    # --------------------------------

    return_series = []

    for result in results:

        returns = (
            result["data"]["Close"]
            .pct_change()
            .rename(
                result["symbol"]
            )
        )

        return_series.append(
            returns
        )

    returns_df = pd.concat(
        return_series,
        axis=1
    )

    returns_df.dropna(
        inplace=True
    )

    if len(valid_symbols) == 1:

        covariance = np.array([
            [
                float(
                    returns_df[
                        valid_symbols[0]
                    ]
                    .var()
                    * 252
                )
            ]
        ])

    else:

        covariance = (
            returns_df
            .cov()
            .values
            * 252
        )

    # Numerical stabilization
    covariance += (
        np.eye(
            len(valid_symbols)
        ) * 1e-8
    )

    # --------------------------------
    # Expected returns
    # --------------------------------

    expected_returns = []

    for symbol in valid_symbols:

        predicted_return = (
            predictions[symbol]
            ["predicted_return"]
        )

        # Annualized internally
        # only for optimization.
        annualized_return = (
            predicted_return *
            (252 / prediction_days)
        )

        expected_returns.append(
            annualized_return
        )

    expected_returns = np.asarray(
        expected_returns,
        dtype=float
    )

    # --------------------------------
    # Genetic Algorithm
    # --------------------------------

    ga_result = (
        optimize_portfolio(
            expected_returns=
                expected_returns,

            covariance=
                covariance,

            risk=
                risk,

            population_size=
                80,

            generations=
                50,

            mutation_rate=
                0.15
        )
    )

    # --------------------------------
    # Build final portfolio
    # --------------------------------

    portfolio = build_portfolio(

        symbols=
            valid_symbols,

        investment_amount=
            investment_amount,

        predictions=
            predictions,

        covariance=
            covariance,

        ga_result=
            ga_result,

        risk=
            risk
    )

    # --------------------------------
    # Extra information
    # --------------------------------

    portfolio[
        "stocks_analyzed"
    ] = len(
        valid_symbols
    )

    portfolio[
        "prediction_horizon_days"
    ] = prediction_days

    portfolio[
        "analysis_timestamp"
    ] = datetime.now(
        timezone.utc
    ).isoformat()

    portfolio[
        "failed_stocks"
    ] = failed_stocks

    return portfolio