from flask import Flask, jsonify, request
from flask_cors import CORS

from services.market_service import (
    get_stock_data,
    search_stocks
)


app = Flask(__name__)

CORS(app)


@app.route("/")
def home():

    return jsonify({
        "status": "online",
        "service": "QuantGen API"
    })


# -----------------------------------------
# STOCK SEARCH
# -----------------------------------------

@app.route("/api/search")
def search():

    query = request.args.get("q", "").strip()

    if not query:

        return jsonify({
            "success": False,
            "message": "Search query is required"
        }), 400

    results = search_stocks(query)

    return jsonify({
        "success": True,
        "results": results
    })


# -----------------------------------------
# MARKET DATA
# -----------------------------------------

@app.route("/api/market/<path:symbol>")
def market_data(symbol):

    period = request.args.get(
        "period",
        "1mo"
    )

    interval = request.args.get(
        "interval",
        "1d"
    )

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


if __name__ == "__main__":

    app.run(
        debug=True,
        port=5000
    )