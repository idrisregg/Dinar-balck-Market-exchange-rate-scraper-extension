interface RatesData {
  rates: {
    eurBuy: number | null;
    eurSell: number | null;
    usdBuy: number | null;
    usdSell: number | null;
    cadBuy: number | null;
    cadSell: number | null;
  };
  market: string;
  source: string;
  updatedAt: string;
  cached: boolean;
}

const API_URL = 'http://localhost:3000/api/rates';

const elements = {
  loading: document.getElementById('loading')!,
  error: document.getElementById('error')!,
  rates: document.getElementById('rates')!,
  updated: document.getElementById('updated')!,
  refresh: document.getElementById('refresh')!,
  eurBuy: document.getElementById('eurBuy')!,
  eurSell: document.getElementById('eurSell')!,
  usdBuy: document.getElementById('usdBuy')!,
  usdSell: document.getElementById('usdSell')!,
  cadBuy: document.getElementById('cadBuy')!,
  cadSell: document.getElementById('cadSell')!,
};

function formatRate(rate: number | null): string {
  if (rate === null) return 'N/A';
  return rate.toFixed(2);
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
  return date.toLocaleDateString();
}

function showLoading() {
  elements.loading.style.display = 'block';
  elements.error.style.display = 'none';
  elements.rates.style.display = 'none';
}

function showError(message: string) {
  elements.loading.style.display = 'none';
  elements.error.style.display = 'block';
  elements.error.textContent = message;
  elements.rates.style.display = 'none';
}

function showRates(data: RatesData) {
  elements.loading.style.display = 'none';
  elements.error.style.display = 'none';
  elements.rates.style.display = 'flex';

  elements.eurBuy.textContent = formatRate(data.rates.eurBuy);
  elements.eurSell.textContent = formatRate(data.rates.eurSell);
  elements.usdBuy.textContent = formatRate(data.rates.usdBuy);
  elements.usdSell.textContent = formatRate(data.rates.usdSell);
  elements.cadBuy.textContent = formatRate(data.rates.cadBuy);
  elements.cadSell.textContent = formatRate(data.rates.cadSell);

  elements.updated.textContent = `Updated ${formatTime(data.updatedAt)}`;
}

async function fetchRates() {
  try {
    showLoading();
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data: RatesData = await response.json();
    showRates(data);
  } catch (error) {
    showError('Failed to load rates. Is the server running on localhost:3000?');
  }
}

elements.refresh.addEventListener('click', fetchRates);

fetchRates();