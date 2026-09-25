from ai_model.engine import analyze_portfolio


print("\n" + "=" * 75)
print("                    QUANTGEN AI")
print("                 PORTFOLIO OPTIMIZER")
print("=" * 75)


# --------------------------------
# STOCKS
# --------------------------------

stock_input = input(
    "\nEnter stock symbols separated by commas\n"
    "Example: RELIANCE.NS,TCS.NS,INFY.NS\n"
    "> "
)

symbols = [
    symbol.strip().upper()
    for symbol in stock_input.split(",")
    if symbol.strip()
]


# --------------------------------
# INVESTMENT
# --------------------------------

investment_input = input(
    "\nEnter investment amount\n"
    "Example: 50000\n"
    "> "
)

investment_amount = float(
    investment_input
)


# --------------------------------
# RISK
# --------------------------------

risk = input(
    "\nRisk preference "
    "(low / medium / high)\n"
    "> "
).strip().lower()


# --------------------------------
# RUN
# --------------------------------

result = analyze_portfolio(

    symbols=symbols,

    investment_amount=
        investment_amount,

    risk=risk,

    prediction_days=3
)


# --------------------------------
# OUTPUT
# --------------------------------

print("\n" + "=" * 75)

print(
    "                  OPTIMIZED ALLOCATION"
)

print("=" * 75)


for stock in result["portfolio"]:

    print("\n" + "-" * 75)

    print(
        "Stock:",
        stock["symbol"]
    )

    print(
        "Allocation:",
        round(
            stock["weight_percent"],
            2
        ),
        "%"
    )

    print(
        "Investment Amount: ₹",
        round(
            stock["amount"],
            2
        )
    )

    print(
        "Expected 3-Day Return:",
        round(
            stock[
                "predicted_return_percent"
            ],
            2
        ),
        "%"
    )

    print(
        "Recent Volatility:",
        round(
            stock[
                "recent_volatility_percent"
            ],
            2
        ),
        "%"
    )

    print(
        "Model Agreement:",
        round(
            stock[
                "model_agreement_percent"
            ],
            2
        ),
        "%"
    )


print("\n" + "=" * 75)

print(
    "Total Investment: ₹",
    result[
        "investment_amount"
    ]
)

print(
    "Risk:",
    result["risk"].upper()
)

print(
    "Expected Portfolio 3-Day Return:",
    round(
        result[
            "total_expected_3d_return_percent"
        ],
        2
    ),
    "%"
)

print(
    "GA Fitness:",
    round(
        result["ga_fitness"],
        6
    )
)

print(
    "GA Generations:",
    result[
        "ga_generations"
    ]
)

print("\n" + "=" * 75)

print(
    "                 AI OPTIMIZATION COMPLETE"
)

print("=" * 75)