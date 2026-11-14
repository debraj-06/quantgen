
import yfinance as yf
import pandas as pd

from datetime import datetime
from zoneinfo import ZoneInfo
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

try:
    from .data_loader import get_market_data
    from .indicators import add_indicators
    from .ml_model import train_test_predict
except ImportError:
    from data_loader import get_market_data
    from indicators import add_indicators
    from ml_model import train_test_predict


analyzer = SentimentIntensityAnalyzer()
MARKET_TZ = ZoneInfo("Asia/Kolkata")


def clean_data(data):
    if data is None or data.empty:
        return pd.DataFrame()

    data = data.copy()

    if isinstance(data.columns, pd.MultiIndex):
        data.columns = data.columns.get_level_values(0)

    data = data.loc[:, ~data.columns.duplicated()]
    return data.dropna(subset=["Close"])


def get_intraday_history(symbol, purchase_date):
    """
    Yahoo Finance generally limits 1-minute history to recent days.
    Older dates may not have intraday data.
    """

    start = pd.Timestamp(purchase_date).normalize()
    end = start + pd.Timedelta(days=1)

    try:
        history = yf.Ticker(symbol).history(
            start=start.strftime("%Y-%m-%d"),
            end=end.strftime("%Y-%m-%d"),
            interval="1m",
            auto_adjust=True,
            prepost=False
        )

        return clean_data(history)

    except Exception as error:
        print("Purchase intraday history error:", error)
        return pd.DataFrame()


def get_purchase_price(symbol, purchase_date, purchase_time, daily_data):
    requested = datetime.strptime(
        f"{purchase_date} {purchase_time}",
        "%Y-%m-%d %H:%M"
    ).replace(tzinfo=MARKET_TZ)

    now = datetime.now(MARKET_TZ)

    if requested > now:
        raise ValueError("Purchase time cannot be in the future.")

    intraday = get_intraday_history(symbol, purchase_date)

    if not intraday.empty:
        index = pd.DatetimeIndex(intraday.index)

        if index.tz is None:
            index = index.tz_localize(MARKET_TZ)
        else:
            index = index.tz_convert(MARKET_TZ)

        intraday.index = index

        same_day = intraday[
            intraday.index.date == requested.date()
        ]

        if not same_day.empty:
            after_time = same_day[
                same_day.index >= requested
            ]

            if not after_time.empty:
                selected = after_time.iloc[0]
            else:
                selected = same_day.iloc[-1]

            return (
                float(selected["Close"]),
                selected.name.strftime("%Y-%m-%d %H:%M"),
                "Intraday price"
            )

    # Explicit fallback for dates without intraday history.
    requested_date = pd.Timestamp(purchase_date).normalize()

    daily_index = pd.DatetimeIndex(daily_data.index)

    if daily_index.tz is not None:
        daily_index = daily_index.tz_localize(None)

    normalized = daily_index.normalize()

    positions = [
        i for i, date in enumerate(normalized)
        if date >= requested_date
    ]

    if not positions:
        raise ValueError("No historical price is available for this date.")

    position = positions[0]

    return (
        float(daily_data["Close"].iloc[position]),
        normalized[position].strftime("%Y-%m-%d"),
        "Daily close fallback"
    )


def get_current_price(symbol, daily_data):
    try:
        intraday = yf.Ticker(symbol).history(
            period="1d",
            interval="1m",
            auto_adjust=True,
            prepost=False
        )

        intraday = clean_data(intraday)

        if not intraday.empty:
            latest = intraday.iloc[-1]

            return (
                float(latest["Close"]),
                str(intraday.index[-1]),
                "Latest intraday price"
            )

    except Exception as error:
        print("Current intraday price error:", error)

    try:
        ticker = yf.Ticker(symbol)
        price = ticker.fast_info.get("last_price")

        if price is not None and float(price) > 0:
            return (
                float(price),
                "Latest provider quote",
                "Provider quote"
            )

    except Exception as error:
        print("Provider quote error:", error)

    return (
        float(daily_data["Close"].iloc[-1]),
        str(daily_data.index[-1]),
        "Daily close fallback"
    )


def get_news_sentiment(symbol, limit=8):
    try:
        raw_news = yf.Ticker(symbol).news or []

        articles = []
        scores = []

        for item in raw_news[:limit]:
            content = item.get("content", item)

            title = (
                content.get("title")
                or item.get("title")
                or ""
            )

            if not title:
                continue

            score = analyzer.polarity_scores(title)["compound"]
            scores.append(score)

            publisher = (
                content.get("publisher")
                or item.get("publisher")
                or "Unknown publisher"
            )

            canonical_url = content.get("canonicalUrl", {})
            link = (
                canonical_url.get("url")
                if isinstance(canonical_url, dict)
                else None
            )

            link = link or item.get("link")

            articles.append({
                "title": title,
                "publisher": publisher,
                "url": link,
                "sentiment": round(float(score), 3)
            })

        average = sum(scores) / len(scores) if scores else 0.0

        if not articles:
            label = "Unavailable"
        elif average >= 0.15:
            label = "Positive"
        elif average <= -0.15:
            label = "Negative"
        else:
            label = "Neutral"

        return {
            "available": bool(articles),
            "score": round(float(average), 3),
            "label": label,
            "articles": articles
        }

    except Exception as error:
        print("News retrieval error:", error)

        return {
            "available": False,
            "score": 0.0,
            "label": "Unavailable",
            "articles": []
        }


def create_recommendation(
    prediction,
    rsi,
    macd,
    macd_signal,
    news_score,
    news_available
):
    bullish = 0
    bearish = 0
    reasons = []

    if prediction >= 0.005:
        bullish += 2
        reasons.append(
            "The ML model predicts a positive 3-day return."
        )
    elif prediction <= -0.005:
        bearish += 2
        reasons.append(
            "The ML model predicts a negative 3-day return."
        )
    else:
        reasons.append(
            "The ML model predicts a relatively small price movement."
        )

    if rsi < 35:
        bullish += 1
        reasons.append("RSI indicates potentially oversold conditions.")
    elif rsi > 70:
        bearish += 1
        reasons.append("RSI indicates potentially overbought conditions.")

    if macd > macd_signal:
        bullish += 1
        reasons.append("MACD is above its signal line.")
    else:
        bearish += 1
        reasons.append("MACD is below its signal line.")

    if news_available:
        if news_score >= 0.15:
            bullish += 1
            reasons.append("Recent news headlines have positive sentiment.")
        elif news_score <= -0.15:
            bearish += 1
            reasons.append("Recent news headlines have negative sentiment.")
        else:
            reasons.append("Recent news sentiment is broadly neutral.")
    else:
        reasons.append(
            "News data was unavailable and was not included in the signal."
        )

    if bullish >= 3 and bullish > bearish:
        signal = "BUY"
    elif bearish >= 3 and bearish > bullish:
        signal = "SELL"
    else:
        signal = "HOLD"

    total = max(bullish + bearish, 1)
    agreement = max(bullish, bearish) / total * 100

    return {
        "signal": signal,
        "bullish_points": bullish,
        "bearish_points": bearish,
        "agreement_score": round(agreement, 1),
        "reasons": reasons
    }


def analyze_holding(symbol, purchase_date, purchase_time, invested_amount):
    symbol = str(symbol).strip().upper()
    invested_amount = float(invested_amount)

    if not symbol:
        raise ValueError("Stock symbol is required.")

    if invested_amount <= 0:
        raise ValueError("Investment amount must be greater than zero.")

    daily_data = clean_data(
        get_market_data(
            symbol,
            period="5y",
            interval="1d"
        )
    )

    if daily_data.empty or len(daily_data) < 100:
        raise ValueError("Not enough historical data for this stock.")

    indicator_data = add_indicators(daily_data).dropna()

    if indicator_data.empty:
        raise ValueError("Unable to calculate technical indicators.")

    ml_result = train_test_predict(
        indicator_data,
        prediction_days=3
    )

    purchase_price, matched_time, purchase_source = get_purchase_price(
        symbol,
        purchase_date,
        purchase_time,
        daily_data
    )

    current_price, current_price_time, current_source = get_current_price(
        symbol,
        daily_data
    )

    shares = invested_amount / purchase_price
    current_value = shares * current_price
    profit_loss = current_value - invested_amount
    profit_loss_percent = profit_loss / invested_amount * 100

    latest = indicator_data.iloc[-1]

    rsi = float(latest["RSI"])
    macd = float(latest["MACD"])
    macd_signal = float(latest["MACD_Signal"])

    news = get_news_sentiment(symbol)

    prediction = float(ml_result["predicted_return"])

    recommendation = create_recommendation(
        prediction=prediction,
        rsi=rsi,
        macd=macd,
        macd_signal=macd_signal,
        news_score=news["score"],
        news_available=news["available"]
    )

    add_more = (
        recommendation["signal"] == "BUY"
        and prediction >= 0.01
        and (not news["available"] or news["score"] >= 0)
    )

    extra_amount = (
        round(invested_amount * 0.10, 2)
        if add_more else 0.0
    )

    return {
        "symbol": symbol,
        "purchase_date": purchase_date,
        "purchase_time": purchase_time,
        "matched_purchase_time": matched_time,
        "purchase_price_source": purchase_source,
        "current_price_source": current_source,
        "current_price_time": current_price_time,

        "invested_amount": round(invested_amount, 2),
        "purchase_price": round(purchase_price, 2),
        "estimated_shares": round(shares, 6),
        "current_price": round(current_price, 2),
        "current_value": round(current_value, 2),
        "profit_loss": round(profit_loss, 2),
        "profit_loss_percent": round(profit_loss_percent, 2),

        "prediction_days": ml_result["prediction_days"],
        "predicted_return_percent": round(
            float(ml_result["predicted_return_percent"]), 2
        ),
        "recent_volatility_percent": round(
            float(ml_result["recent_volatility_percent"]), 2
        ),
        "model_agreement_percent": round(
            float(ml_result["model_agreement_percent"]), 2
        ),

        "technical_indicators": {
            "rsi": round(rsi, 2),
            "macd": round(macd, 4),
            "macd_signal": round(macd_signal, 4)
        },

        "recommendation": recommendation,

        "additional_investment": {
            "suggested": add_more,
            "suggested_amount": extra_amount,
            "reason": (
                "Current model and indicator conditions are positive. "
                "Review your risk limits before adding to this position."
                if add_more else
                "No additional investment is suggested by the current rules."
            )
        },

        "news": news,
        "latest_market_date": ml_result["latest_date"]
    }


def analyze_tracker(holdings):
    if not isinstance(holdings, list) or not holdings:
        raise ValueError("Add at least one stock holding.")

    results = []
    errors = []

    for holding in holdings:
        try:
            result = analyze_holding(
                symbol=holding["symbol"],
                purchase_date=holding["purchase_date"],
                purchase_time=holding["purchase_time"],
                invested_amount=holding["invested_amount"]
            )

            results.append(result)

        except Exception as error:
            errors.append({
                "symbol": holding.get("symbol", "Unknown"),
                "error": str(error)
            })

    if not results:
        raise ValueError(
            "No holdings could be analyzed. Check the stock symbols, dates and times."
        )

    return {
        "holdings": results,
        "total_invested": round(
            sum(item["invested_amount"] for item in results), 2
        ),
        "total_current_value": round(
            sum(item["current_value"] for item in results), 2
        ),
        "total_profit_loss": round(
            sum(item["profit_loss"] for item in results), 2
        ),
        "errors": errors
    }
