
from flask import Flask, jsonify, request
from flask_cors import CORS
import yfinance as yf

from services.market_service import (
    get_stock_data,
    search_stocks
)

from ai_model.engine import analyze_portfolio
from ai_model.tracker import analyze_tracker


app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return jsonify({
        "status": "online",
        "service": "QuantGen API",
        "version": "1.0"
    })


@app.route("/api/search", methods=["GET"])
def search():
    query = request.args.get("q", "").strip()

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


@app.route("/api/market/<path:symbol>", methods=["GET"])
def market_data(symbol):
    period = request.args.get("period", "1mo")
    interval = request.args.get("interval", "1d")

    try:
        data = get_stock_data(symbol, period, interval)

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
        print(f"Market data error for {symbol}:", error)

        return jsonify({
            "success": False,
            "message": str(error)
        }), 500


@app.route("/api/indices", methods=["GET"])
def indices():
    index_config = {
        "NIFTY 50": "^NSEI",
        "SENSEX": "^BSESN"
    }

    results = []

    for name, symbol in index_config.items():
        try:
            ticker = yf.Ticker(symbol)

            intraday = ticker.history(
                period="2d",
                interval="1m",
                auto_adjust=False
            )

            intraday = intraday.dropna(subset=["Close"])

            if intraday.empty:
                raise ValueError(
                    f"No intraday data available for {name}"
                )

            latest_price = float(intraday["Close"].iloc[-1])

            daily = ticker.history(
                period="5d",
                interval="1d",
                auto_adjust=False
            )

            daily = daily.dropna(subset=["Close"])

            if len(daily) >= 2:
                previous_close = float(daily["Close"].iloc[-2])
            else:
                previous_close = latest_price

            change = latest_price - previous_close

            change_percent = (
                change / previous_close * 100
                if previous_close else 0
            )

            results.append({
                "name": name,
                "symbol": symbol,
                "price": round(latest_price, 2),
                "change": round(change, 2),
                "change_percent": round(change_percent, 2)
            })

        except Exception as error:
            print(f"Index error for {name}:", error)

            results.append({
                "name": name,
                "symbol": symbol,
                "price": None,
                "change": None,
                "change_percent": None,
                "error": str(error)
            })

    return jsonify({
        "success": True,
        "indices": results
    })


@app.route("/api/portfolio/optimize", methods=["POST"])
def optimize_portfolio():
    try:
        payload = request.get_json(silent=True) or {}

        symbols = payload.get("symbols", [])
        investment_amount = payload.get("investment_amount", 0)
        risk = str(payload.get("risk", "medium")).lower().strip()

        if not isinstance(symbols, list):
            return jsonify({
                "success": False,
                "error": "symbols must be a list"
            }), 400

        symbols = [
            str(symbol).strip().upper()
            for symbol in symbols
            if str(symbol).strip()
        ]

        symbols = list(dict.fromkeys(symbols))

        if not symbols:
            return jsonify({
                "success": False,
                "error": "Select at least one stock."
            }), 400

        try:
            investment_amount = float(investment_amount)
        except (TypeError, ValueError):
            return jsonify({
                "success": False,
                "error": "Investment amount must be a number."
            }), 400

        if investment_amount <= 0:
            return jsonify({
                "success": False,
                "error": "Investment amount must be greater than 0."
            }), 400

        if risk not in ["low", "medium", "high"]:
            return jsonify({
                "success": False,
                "error": "Risk must be low, medium, or high."
            }), 400

        result = analyze_portfolio(
            symbols=symbols,
            investment_amount=investment_amount,
            risk=risk,
            prediction_days=3
        )

        return jsonify({
            "success": True,
            **result
        })

    except Exception as error:
        print("Portfolio optimization error:", error)

        return jsonify({
            "success": False,
            "error": str(error)
        }), 500


@app.route("/api/tracker/analyze", methods=["POST"])
def tracker_analyze():
    try:
        payload = request.get_json(silent=True) or {}
        holdings = payload.get("holdings", [])

        if not isinstance(holdings, list) or not holdings:
            return jsonify({
                "success": False,
                "error": "Add at least one stock holding."
            }), 400

        for index, holding in enumerate(holdings):
            if not isinstance(holding, dict):
                return jsonify({
                    "success": False,
                    "error": f"Holding {index + 1} must be an object."
                }), 400

            required_fields = [
                "symbol",
                "purchase_date",
                "purchase_time",
                "invested_amount"
            ]

            for field in required_fields:
                if holding.get(field) in (None, ""):
                    return jsonify({
                        "success": False,
                        "error": (
                            f"{field.replace('_', ' ').title()} "
                            f"is required for holding {index + 1}."
                        )
                    }), 400

            try:
                amount = float(holding["invested_amount"])
                if amount <= 0:
                    raise ValueError()
            except (TypeError, ValueError):
                return jsonify({
                    "success": False,
                    "error": "Investment amount must be greater than zero."
                }), 400

        result = analyze_tracker(holdings)

        return jsonify({
            "success": True,
            **result
        })

    except ValueError as error:
        return jsonify({
            "success": False,
            "error": str(error)
        }), 400

    except Exception as error:
        print("Tracker analysis error:", error)

        return jsonify({
            "success": False,
            "error": "Tracker analysis failed. Please try again."
        }), 500


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
