
const API_BASE_URL = "http://127.0.0.1:5000/api";

async function readResponse(response, fallbackMessage) {
  let result;

  try {
    result = await response.json();
  } catch {
    throw new Error("Invalid response from server.");
  }

  if (!response.ok || result.success === false) {
    throw new Error(
      result.error ||
      result.message ||
      fallbackMessage
    );
  }

  return result;
}


// ======================================================
// PORTFOLIO TRACKER
// ======================================================

export async function analyzeTracker(holdings) {
  if (!Array.isArray(holdings) || holdings.length === 0) {
    throw new Error("Add at least one stock holding.");
  }

  const response = await fetch(
    `${API_BASE_URL}/tracker/analyze`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ holdings }),
    }
  );

  const result = await readResponse(
    response,
    "Tracker analysis failed."
  );

  return result;
}


// ======================================================
// MARKET DATA
// ======================================================

export async function getMarketData(
  symbol,
  period = "1mo",
  interval = "1d"
) {
  const response = await fetch(
    `${API_BASE_URL}/market/${encodeURIComponent(symbol)}?period=${encodeURIComponent(period)}&interval=${encodeURIComponent(interval)}`
  );

  return await readResponse(
    response,
    "Failed to fetch market data."
  );
}


// ======================================================
// STOCK SEARCH
// ======================================================


export async function searchStocks(query) {
  const cleanQuery = query?.trim() || "";

  if (!cleanQuery) return [];

  const response = await fetch(
    `${API_BASE_URL}/search?q=${encodeURIComponent(cleanQuery)}`
  );

  let result;

  try {
    result = await response.json();
  } catch {
    throw new Error("Invalid response from search server.");
  }

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || "Unable to fetch search results."
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

  const result = await readResponse(
    response,
    "Failed to fetch index data."
  );

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
  if (!Array.isArray(symbols) || symbols.length === 0) {
    throw new Error("Select at least one stock.");
  }

  if (!investmentAmount || Number(investmentAmount) <= 0) {
    throw new Error("Enter a valid investment amount.");
  }

  const response = await fetch(
    `${API_BASE_URL}/portfolio/optimize`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        symbols,
        investment_amount: Number(investmentAmount),
        risk
      }),
    }
  );

  return await readResponse(
    response,
    "Portfolio optimization failed."
  );
}
