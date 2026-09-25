const API_BASE_URL = "http://127.0.0.1:5000/api";


// ======================================================
// MARKET DATA
// ======================================================

export async function getMarketData(
  symbol,
  period = "1mo",
  interval = "1d"
) {
  const response = await fetch(
    `${API_BASE_URL}/market/${encodeURIComponent(
      symbol
    )}?period=${period}&interval=${interval}`
  );

  let result;

  try {
    result = await response.json();
  } catch {
    throw new Error(
      "Invalid response from market server."
    );
  }

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to fetch market data."
    );
  }

  if (!result.success) {
    throw new Error(
      result.message ||
        "Unable to fetch market data."
    );
  }

  return result;
}


// ======================================================
// STOCK SEARCH
// ======================================================

export async function searchStocks(query) {
  const cleanQuery =
    query?.trim() || "";

  if (!cleanQuery) {
    return [];
  }

  const response = await fetch(
    `${API_BASE_URL}/search?q=${encodeURIComponent(
      cleanQuery
    )}`
  );

  let result;

  try {
    result = await response.json();
  } catch {
    throw new Error(
      "Invalid response from search server."
    );
  }

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to search stocks."
    );
  }

  if (!result.success) {
    throw new Error(
      result.message ||
        "Unable to fetch search results."
    );
  }

  return result.results || [];
}


// ======================================================
// LIVE NIFTY + SENSEX
// ======================================================

export async function getIndices() {
  const response = await fetch(
    `${API_BASE_URL}/indices`
  );

  let result;

  try {
    result = await response.json();
  } catch {
    throw new Error(
      "Invalid response from index server."
    );
  }

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to fetch index data."
    );
  }

  if (!result.success) {
    throw new Error(
      result.message ||
        "Unable to fetch index data."
    );
  }

  return result.indices || [];
}


// ======================================================
// AI PORTFOLIO OPTIMIZER
// ======================================================

export async function optimizePortfolio({
  symbols,
  investmentAmount,
  risk
}) {
  if (
    !Array.isArray(symbols) ||
    symbols.length === 0
  ) {
    throw new Error(
      "Select at least one stock."
    );
  }

  if (
    !investmentAmount ||
    Number(investmentAmount) <= 0
  ) {
    throw new Error(
      "Enter a valid investment amount."
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/portfolio/optimize`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        symbols,
        investment_amount:
          Number(investmentAmount),
        risk
      })
    }
  );

  let result;

  try {
    result = await response.json();
  } catch {
    throw new Error(
      "Invalid response from AI server."
    );
  }

  if (!response.ok) {
    throw new Error(
      result.error ||
        result.message ||
        "Portfolio optimization failed."
    );
  }

  if (!result.success) {
    throw new Error(
      result.error ||
        result.message ||
        "Portfolio optimization failed."
    );
  }

  return result;
}