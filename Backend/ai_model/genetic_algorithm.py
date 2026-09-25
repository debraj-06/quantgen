import random
import numpy as np


RISK_SETTINGS = {

    "low": {
        "risk_penalty": 1.80,
        "max_weight": 0.40
    },

    "medium": {
        "risk_penalty": 1.00,
        "max_weight": 0.50
    },

    "high": {
        "risk_penalty": 0.45,
        "max_weight": 0.70
    }
}


def get_constraints(
    number_of_stocks,
    risk
):

    settings = RISK_SETTINGS[
        risk
    ]

    if number_of_stocks == 1:

        return {
            "min_weight": 1.0,
            "max_weight": 1.0
        }

    min_weight = min(
        0.05,
        0.50 / number_of_stocks
    )

    max_weight = max(
        settings["max_weight"],
        (1.0 / number_of_stocks) + 0.02
    )

    max_weight = min(
        max_weight,
        1.0
    )

    return {
        "min_weight": min_weight,
        "max_weight": max_weight
    }


def repair_weights(
    weights,
    min_weight,
    max_weight
):

    weights = np.asarray(
        weights,
        dtype=float
    )

    weights = np.clip(
        weights,
        min_weight,
        max_weight
    )

    for _ in range(100):

        difference = (
            1.0 -
            weights.sum()
        )

        if abs(difference) < 1e-10:
            break

        if difference > 0:

            room = (
                max_weight -
                weights
            )

            total_room = room.sum()

            if total_room <= 0:
                break

            weights += (
                room /
                total_room *
                difference
            )

        else:

            room = (
                weights -
                min_weight
            )

            total_room = room.sum()

            if total_room <= 0:
                break

            weights -= (
                room /
                total_room *
                abs(difference)
            )

    weights = np.clip(
        weights,
        min_weight,
        max_weight
    )

    weights /= weights.sum()

    return weights


def random_weights(
    number_of_stocks,
    min_weight,
    max_weight
):

    raw = np.random.dirichlet(
        np.ones(
            number_of_stocks
        )
    )

    return repair_weights(
        raw,
        min_weight,
        max_weight
    )


def calculate_fitness(
    weights,
    expected_returns,
    covariance,
    risk_penalty
):

    portfolio_return = float(
        np.dot(
            weights,
            expected_returns
        )
    )

    portfolio_variance = float(
        weights.T
        @ covariance
        @ weights
    )

    portfolio_volatility = float(
        np.sqrt(
            max(
                portfolio_variance,
                0
            )
        )
    )

    concentration_penalty = float(
        np.sum(
            weights ** 2
        )
    ) * 0.08

    fitness = (
        portfolio_return
        -
        risk_penalty *
        portfolio_volatility
        -
        concentration_penalty
    )

    return float(
        fitness
    )


def crossover(
    parent1,
    parent2
):

    alpha = random.random()

    child = (
        alpha * parent1
        +
        (1 - alpha) * parent2
    )

    return child


def mutate(
    weights,
    mutation_rate=0.15,
    mutation_strength=0.08
):

    child = weights.copy()

    for index in range(
        len(child)
    ):

        if (
            random.random()
            <
            mutation_rate
        ):

            child[index] += (
                np.random.normal(
                    0,
                    mutation_strength
                )
            )

    return child


def optimize_portfolio(
    expected_returns,
    covariance,
    risk="medium",
    population_size=80,
    generations=50,
    mutation_rate=0.15
):

    expected_returns = np.asarray(
        expected_returns,
        dtype=float
    )

    covariance = np.asarray(
        covariance,
        dtype=float
    )

    number_of_stocks = len(
        expected_returns
    )

    constraints = get_constraints(
        number_of_stocks,
        risk
    )

    min_weight = constraints[
        "min_weight"
    ]

    max_weight = constraints[
        "max_weight"
    ]

    risk_penalty = (
        RISK_SETTINGS[risk]
        ["risk_penalty"]
    )

    # --------------------------------
    # Initial population
    # --------------------------------

    population = []

    for _ in range(
        population_size
    ):

        population.append(
            random_weights(
                number_of_stocks,
                min_weight,
                max_weight
            )
        )

    best_weights = None
    best_fitness = -np.inf

    # --------------------------------
    # Evolution
    # --------------------------------

    for _ in range(
        generations
    ):

        scored_population = []

        for weights in population:

            fitness = calculate_fitness(
                weights,
                expected_returns,
                covariance,
                risk_penalty
            )

            scored_population.append(
                (
                    fitness,
                    weights
                )
            )

            if fitness > best_fitness:

                best_fitness = fitness

                best_weights = (
                    weights.copy()
                )

        scored_population.sort(
            key=lambda item: item[0],
            reverse=True
        )

        elite_count = max(
            2,
            population_size // 7
        )

        elites = [
            item[1].copy()
            for item in
            scored_population[
                :elite_count
            ]
        ]

        new_population = elites

        while len(
            new_population
        ) < population_size:

            parent1 = random.choice(
                elites
            )

            parent2 = random.choice(
                elites
            )

            child = crossover(
                parent1,
                parent2
            )

            child = mutate(
                child,
                mutation_rate
            )

            child = repair_weights(
                child,
                min_weight,
                max_weight
            )

            new_population.append(
                child
            )

        population = (
            new_population
        )

    return {

        "weights":
            best_weights,

        "fitness":
            float(best_fitness),

        "generations":
            generations,

        "population_size":
            population_size
    }