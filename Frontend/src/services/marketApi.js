const API_BASE_URL = "http://127.0.0.1:5000/api";


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

  if (!response.ok) {
    throw new Error(
      "Failed to fetch market data"
    );
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(
      result.message ||
      "Unable to fetch market data"
    );
  }

  return result;
}


export async function searchStocks(query) {

  if (!query.trim()) {
    return [];
  }

  const response = await fetch(
    `${API_BASE_URL}/search?q=${encodeURIComponent(
      query
    )}`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to search stocks"
    );
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(
      result.message ||
      "Unable to search stocks"
    );
  }

  return result.results;
}