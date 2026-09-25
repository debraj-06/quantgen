import numpy as np


def build_portfolio(
    symbols,
    investment_amount,
    predictions,
    covariance,
    ga_result,
    risk
):

    weights = ga_result[
        "weights"
    ]

    portfolio = []

    total_expected_return = 0.0

    for index, symbol in enumerate(
        symbols
    ):

        weight = float(
            weights[index]
        )

        amount = float(
            investment_amount *
            weight
        )

        prediction = (
            predictions[symbol]
        )

        predicted_return = float(
            prediction[
                "predicted_return"
            ]
        )

        total_expected_return += (
            weight *
            predicted_return
        )

        portfolio.append({

            "symbol":
                symbol,

            "weight":
                weight,

            "weight_percent":
                weight * 100,

            "amount":
                amount,

            "predicted_return":
                predicted_return,

            "predicted_return_percent":
                prediction[
                    "predicted_return_percent"
                ],

            "recent_volatility":
                prediction[
                    "recent_volatility"
                ],

            "recent_volatility_percent":
                prediction[
                    "recent_volatility_percent"
                ],

            "model_agreement":
                prediction[
                    "model_agreement"
                ],

            "model_agreement_percent":
                prediction[
                    "model_agreement_percent"
                ],

            "latest_price":
                prediction[
                    "latest_price"
                ],

            "latest_date":
                prediction[
                    "latest_date"
                ],

            "allocation_reason": (
                "Higher expected-return "
                "contribution"
                if weight >=
                np.mean(weights)
                else
                "Diversification and "
                "risk control"
            )
        })

    portfolio.sort(
        key=lambda item:
            item["weight"],
        reverse=True
    )

    return {

        "risk":
            risk,

        "investment_amount":
            float(
                investment_amount
            ),

        "portfolio":
            portfolio,

        "total_expected_3d_return_percent":
            total_expected_return * 100,

        "ga_fitness":
            float(
                ga_result["fitness"]
            ),

        "ga_generations":
            int(
                ga_result["generations"]
            )
    }