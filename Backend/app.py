from flask import Flask, jsonify, request
from flask_cors import CORS

from services.market_service import (
    get_stock_data,
    search_stocks
)

from ai_model.engine import analyze_portfolio


app = Flask(__name__)

CORS(app)


# =========================================================
# HOME
# =========================================================

@app.route("/")
def home():

    return jsonify({
        "status": "online",
        "service": "QuantGen API",
        "version": "1.0"
    })


# =========================================================
# STOCK SEARCH
# =========================================================

@app.route("/api/search", methods=["GET"])
def search():

    query = request.args.get(
        "q",
        ""
    ).strip()

    if not query:

        return jsonify({
            "success": False,
            "message": "Search query is required"
        }), 400

    try:

        results = search_stocks(query)

        return jsonify({
            "success": True,
            "results": results
        })

    except Exception as error:

        print("Stock search error:", error)

        return jsonify({
            "success": False,
            "message": str(error)
        }), 500


# =========================================================
# MARKET DATA
# =========================================================

@app.route(
    "/api/market/<path:symbol>",
    methods=["GET"]
)
def market_data(symbol):

    period = request.args.get(
        "period",
        "1mo"
    )

    interval = request.args.get(
        "interval",
        "1d"
    )

    try:

        data = get_stock_data(
            symbol,
            period,
            interval
        )

        if data is None:

            return jsonify({
                "success": False,
                "message": "Unable to fetch market data"
            }), 404

        return jsonify({
            "success": True,
            "symbol": symbol.upper(),
            "period": period,
            "interval": interval,
            "data": data
        })

    except Exception as error:

        print(
            f"Market data error for {symbol}:",
            error
        )

        return jsonify({
            "success": False,
            "message": str(error)
        }), 500


# =========================================================
# AI PORTFOLIO OPTIMIZER
# =========================================================

@app.route(
    "/api/portfolio/optimize",
    methods=["POST"]
)
def optimize_portfolio():

    try:

        payload = request.get_json(
            silent=True
        ) or {}

        # -------------------------------------------------
        # GET INPUTS
        # -------------------------------------------------

        symbols = payload.get(
            "symbols",
            []
        )

        investment_amount = payload.get(
            "investment_amount",
            0
        )

        risk = payload.get(
            "risk",
            "medium"
        )

        # -------------------------------------------------
        # VALIDATE SYMBOLS
        # -------------------------------------------------

        if not isinstance(
            symbols,
            list
        ):

            return jsonify({
                "success": False,
                "error": "symbols must be a list"
            }), 400

        symbols = [
            str(symbol).strip().upper()
            for symbol in symbols
            if str(symbol).strip()
        ]

        # Remove duplicates
        symbols = list(
            dict.fromkeys(symbols)
        )

        if len(symbols) == 0:

            return jsonify({
                "success": False,
                "error": "Select at least one stock."
            }), 400

        # -------------------------------------------------
        # VALIDATE INVESTMENT
        # -------------------------------------------------

        try:

            investment_amount = float(
                investment_amount
            )

        except (
            TypeError,
            ValueError
        ):

            return jsonify({
                "success": False,
                "error": "Investment amount must be a number."
            }), 400

        if investment_amount <= 0:

            return jsonify({
                "success": False,
                "error": "Investment amount must be greater than 0."
            }), 400

        # -------------------------------------------------
        # VALIDATE RISK
        # -------------------------------------------------

        risk = str(
            risk
        ).lower().strip()

        if risk not in [
            "low",
            "medium",
            "high"
        ]:

            return jsonify({
                "success": False,
                "error": "Risk must be low, medium, or high."
            }), 400

        # -------------------------------------------------
        # RUN AI + GENETIC ALGORITHM
        # -------------------------------------------------

        result = analyze_portfolio(
            symbols=symbols,
            investment_amount=investment_amount,
            risk=risk,
            prediction_days=3
        )

        # -------------------------------------------------
        # RETURN RESULT
        # -------------------------------------------------

        return jsonify({
            "success": True,
            **result
        })

    except Exception as error:

        print(
            "Portfolio optimization error:",
            error
        )

        return jsonify({
            "success": False,
            "error": str(error)
        }), 500


# =========================================================
# RUN SERVER
# =========================================================

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )