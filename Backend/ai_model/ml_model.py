import numpy as np

from sklearn.ensemble import (
    RandomForestRegressor,
    ExtraTreesRegressor,
    GradientBoostingRegressor
)

from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score
)


FEATURE_COLUMNS = [

    "Return",
    "Return_3D",
    "Return_5D",
    "Return_10D",
    "Return_20D",

    "Price_SMA10_Ratio",
    "Price_SMA20_Ratio",
    "Price_SMA50_Ratio",

    "MACD",
    "MACD_Signal",
    "MACD_Histogram",

    "RSI",

    "Volatility10",
    "Volatility20",

    "ATR_Ratio",

    "BB_Position",

    "Momentum10",
    "Momentum20",

    "Volume_Ratio",
    "Volume_Change",

    "High_Low_Range",
    "Open_Close_Range"
]


def build_training_data(
    data,
    prediction_days=3
):

    data = data.copy()

    # Future 3-trading-day return
    data["Future_Return"] = (
        data["Close"]
        .shift(-prediction_days)
        /
        data["Close"]
    ) - 1

    model_data = data[
        FEATURE_COLUMNS +
        ["Future_Return"]
    ].copy()

    model_data.replace(
        [np.inf, -np.inf],
        np.nan,
        inplace=True
    )

    model_data.dropna(
        inplace=True
    )

    return model_data


def create_models():

    return {

        "random_forest":
            RandomForestRegressor(
                n_estimators=300,
                max_depth=8,
                min_samples_leaf=5,
                random_state=42,
                n_jobs=-1
            ),

        "extra_trees":
            ExtraTreesRegressor(
                n_estimators=300,
                max_depth=8,
                min_samples_leaf=5,
                random_state=42,
                n_jobs=-1
            ),

        "gradient_boosting":
            GradientBoostingRegressor(
                n_estimators=250,
                learning_rate=0.03,
                max_depth=3,
                min_samples_leaf=5,
                random_state=42
            )
    }


def train_test_predict(
    data,
    prediction_days=3,
    train_ratio=0.80
):

    model_data = build_training_data(
        data,
        prediction_days
    )

    if len(model_data) < 250:

        raise ValueError(
            "Not enough historical data "
            "for ML training."
        )

    X = model_data[
        FEATURE_COLUMNS
    ]

    y = model_data[
        "Future_Return"
    ]

    split_index = int(
        len(model_data) *
        train_ratio
    )

    X_train = X.iloc[
        :split_index
    ]

    X_test = X.iloc[
        split_index:
    ]

    y_train = y.iloc[
        :split_index
    ]

    y_test = y.iloc[
        split_index:
    ]

    models = create_models()

    test_predictions = []

    # --------------------------------
    # Historical evaluation
    # --------------------------------

    for model in models.values():

        model.fit(
            X_train,
            y_train
        )

        prediction = model.predict(
            X_test
        )

        test_predictions.append(
            prediction
        )

    ensemble_test_prediction = (
        np.mean(
            test_predictions,
            axis=0
        )
    )

    mae = mean_absolute_error(
        y_test,
        ensemble_test_prediction
    )

    rmse = np.sqrt(
        mean_squared_error(
            y_test,
            ensemble_test_prediction
        )
    )

    r2 = r2_score(
        y_test,
        ensemble_test_prediction
    )

    # --------------------------------
    # Final models
    # Train on all historical data
    # --------------------------------

    final_models = create_models()

    for model in final_models.values():

        model.fit(
            X,
            y
        )

    # --------------------------------
    # Current/latest market state
    # --------------------------------

    latest_row = data[
        FEATURE_COLUMNS
    ].iloc[-1:]

    model_predictions = []

    for model in final_models.values():

        prediction = float(
            model.predict(
                latest_row
            )[0]
        )

        model_predictions.append(
            prediction
        )

    predicted_return = float(
        np.mean(
            model_predictions
        )
    )

    # Keep predictions within
    # a sensible range.
    predicted_return = float(
        np.clip(
            predicted_return,
            -0.10,
            0.10
        )
    )

    # --------------------------------
    # Model agreement
    # --------------------------------

    model_disagreement = float(
        np.std(
            model_predictions
        )
    )

    training_target_std = max(
        float(
            np.std(y_train)
        ),
        1e-6
    )

    model_agreement = float(
        np.clip(
            1 -
            (
                model_disagreement /
                training_target_std
            ),
            0,
            1
        )
    )

    # --------------------------------
    # Latest price
    # --------------------------------

    latest_price = float(
        data["Close"].iloc[-1]
    )

    # --------------------------------
    # Recent volatility
    # --------------------------------

    recent_volatility = float(
        data["Return"]
        .rolling(20)
        .std()
        .iloc[-1]
        * np.sqrt(252)
    )

    # --------------------------------
    # Latest date
    # --------------------------------

    latest_date = (
        data.index[-1]
        .strftime("%Y-%m-%d")
    )

    return {

        "prediction_days":
            prediction_days,

        "latest_price":
            latest_price,

        "latest_date":
            latest_date,

        "predicted_return":
            predicted_return,

        "predicted_return_percent":
            predicted_return * 100,

        "recent_volatility":
            recent_volatility,

        "recent_volatility_percent":
            recent_volatility * 100,

        "model_agreement":
            model_agreement,

        "model_agreement_percent":
            model_agreement * 100,

        "model_disagreement":
            model_disagreement,

        "evaluation": {

            "mae":
                float(mae),

            "rmse":
                float(rmse),

            "r2":
                float(r2)
        }
    }