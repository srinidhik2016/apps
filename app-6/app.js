const STORAGE_KEY = 'marketpulse-watchlist';
const ALERTS_KEY = 'marketpulse-alerts';
const TICK_MS = 3000;
const MAX_ALERTS = 50;

const watchlistEl = document.querySelector('#watchlist');
const emptyNote = document.querySelector('#empty-note');
const alertsLogEl = document.querySelector('#alerts-log');
const addForm = document.querySelector('#add-form');
const symbolInput = document.querySelector('#symbol-input');
const priceInput = document.querySelector('#price-input');
const thresholdInput = document.querySelector('#threshold-input');
const notifyButton = document.querySelector('#notify-button');
const installButton = document.querySelector('#install-button');
const downloadButton = document.querySelector('#download-button');
const toastStack = document.querySelector('#toast-stack');

function loadJSON(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch (error) {
    return fallback;
  }
}

let watchlist = loadJSON(STORAGE_KEY, []);
let alerts = loadJSON(ALERTS_KEY, []);

function saveWatchlist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
}

function saveAlerts() {
  localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
}

function formatMoney(value) {
  return `$${value.toFixed(2)}`;
}

function formatPercent(value) {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

function formatTime(timestamp) {
  return new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit', second: '2-digit' }).format(new Date(timestamp));
}

function buildSparkline(history) {
  if (history.length < 2) {
    return '<svg class="sparkline" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true"><polyline points="0,15 100,15" /></svg>';
  }
  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = max - min || 1;
  const points = history
    .map((price, index) => {
      const x = (index / (history.length - 1)) * 100;
      const y = 28 - ((price - min) / range) * 26;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  return `<svg class="sparkline" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true"><polyline points="${points}" /></svg>`;
}

function renderWatchlist() {
  emptyNote.hidden = watchlist.length > 0;
  watchlistEl.querySelectorAll('.stock-card').forEach((card) => card.remove());

  const now = Date.now();
  watchlist.forEach((stock) => {
    const changeSinceAdded = ((stock.price - stock.basePrice) / stock.basePrice) * 100;
    const direction = changeSinceAdded > 0 ? 'up' : changeSinceAdded < 0 ? 'down' : 'flat';
    const isHighlighted = stock.highlightUntil && now < stock.highlightUntil;

    const card = document.createElement('article');
    card.className = `stock-card ${direction}${isHighlighted ? ' changed' : ''}`;
    card.innerHTML = `
      <div class="stock-head">
        <span class="stock-symbol">${stock.symbol}</span>
        <button class="remove-button" data-symbol="${stock.symbol}" aria-label="Remove ${stock.symbol}" title="Remove">✕</button>
      </div>
      ${buildSparkline(stock.history || [stock.price])}
      <p class="stock-price">${formatMoney(stock.price)}</p>
      <p class="stock-change ${direction}">${formatPercent(changeSinceAdded)} since added</p>
      <p class="stock-meta">Alert threshold: ${stock.threshold}%</p>
    `;
    watchlistEl.appendChild(card);
  });
}

function renderAlerts() {
  const hasAlerts = alerts.length > 0;
  alertsLogEl.querySelectorAll('.alert-item').forEach((item) => item.remove());
  const placeholder = alertsLogEl.querySelector('.empty-note');
  if (placeholder) placeholder.hidden = hasAlerts;

  alerts.slice(0, MAX_ALERTS).forEach((alert) => {
    const item = document.createElement('li');
    item.className = `alert-item ${alert.direction}`;
    item.innerHTML = `<span class="alert-symbol">${alert.symbol}</span> ${alert.message} <time>${formatTime(alert.timestamp)}</time>`;
    alertsLogEl.appendChild(item);
  });
}

function showToast(message, direction) {
  const toast = document.createElement('div');
  toast.className = `toast ${direction}`;
  toast.textContent = message;
  toastStack.appendChild(toast);
  setTimeout(() => toast.classList.add('visible'), 10);
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 300);
  }, 4200);
}

function recordAlert(stock, direction, changePercent) {
  const message = `${direction === 'up' ? 'jumped' : 'dropped'} ${Math.abs(changePercent).toFixed(2)}% to ${formatMoney(stock.price)}`;
  alerts.unshift({ symbol: stock.symbol, message, direction, timestamp: Date.now() });
  alerts = alerts.slice(0, MAX_ALERTS);
  stock.highlightUntil = Date.now() + 2500;
  saveAlerts();
  renderAlerts();
  showToast(`${stock.symbol} ${message}`, direction);

  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(`${stock.symbol} price alert`, { body: `${stock.symbol} ${message}` });
  }
}

const HISTORY_LENGTH = 20;

function tick() {
  if (watchlist.length === 0) return;
  watchlist.forEach((stock) => {
    const volatility = 0.012;
    const drift = (Math.random() * 2 - 1) * volatility;
    stock.price = Math.max(0.01, stock.price * (1 + drift));
    stock.history = [...(stock.history || [stock.price]), stock.price].slice(-HISTORY_LENGTH);

    const changeFromLastAlert = ((stock.price - stock.lastAlertPrice) / stock.lastAlertPrice) * 100;
    if (Math.abs(changeFromLastAlert) >= stock.threshold) {
      const direction = changeFromLastAlert > 0 ? 'up' : 'down';
      stock.lastAlertPrice = stock.price;
      recordAlert(stock, direction, changeFromLastAlert);
    }
  });
  saveWatchlist();
  renderWatchlist();
}

addForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const symbol = symbolInput.value.trim().toUpperCase().replace(/[^A-Z0-9.]/g, '');
  const price = Number(priceInput.value);
  const threshold = Number(thresholdInput.value);

  if (!symbol || !(price > 0) || !(threshold > 0)) return;
  if (watchlist.some((stock) => stock.symbol === symbol)) {
    showToast(`${symbol} is already on your watchlist`, 'flat');
    return;
  }

  watchlist.push({ symbol, basePrice: price, price, threshold, lastAlertPrice: price, addedAt: Date.now(), history: [price] });
  saveWatchlist();
  renderWatchlist();
  addForm.reset();
  thresholdInput.value = '2';
  symbolInput.focus();
});

watchlistEl.addEventListener('click', (event) => {
  const button = event.target.closest('.remove-button');
  if (!button) return;
  watchlist = watchlist.filter((stock) => stock.symbol !== button.dataset.symbol);
  saveWatchlist();
  renderWatchlist();
});

notifyButton.addEventListener('click', async () => {
  if (!('Notification' in window)) {
    showToast('Notifications are not supported in this browser', 'flat');
    return;
  }
  const permission = await Notification.requestPermission();
  notifyButton.textContent = permission === 'granted' ? 'Alerts enabled' : 'Enable alerts';
  notifyButton.disabled = permission === 'granted';
});

downloadButton.addEventListener('click', () => {
  const rows = [['Symbol', 'Current Price', 'Base Price', 'Change Since Added (%)', 'Alert Threshold (%)']];
  watchlist.forEach((stock) => {
    const change = ((stock.price - stock.basePrice) / stock.basePrice) * 100;
    rows.push([stock.symbol, stock.price.toFixed(2), stock.basePrice.toFixed(2), change.toFixed(2), stock.threshold]);
  });
  rows.push([]);
  rows.push(['Alert Log']);
  rows.push(['Symbol', 'Message', 'Time']);
  alerts.forEach((alert) => rows.push([alert.symbol, alert.message, new Date(alert.timestamp).toISOString()]));

  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `marketpulse-report-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
});

let installPromptEvent = null;
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  installPromptEvent = event;
  installButton.hidden = false;
});

installButton.addEventListener('click', async () => {
  if (!installPromptEvent) return;
  installPromptEvent.prompt();
  await installPromptEvent.userChoice;
  installPromptEvent = null;
  installButton.hidden = true;
});

window.addEventListener('appinstalled', () => {
  installButton.hidden = true;
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {});
  });
}

if ('Notification' in window && Notification.permission === 'granted') {
  notifyButton.textContent = 'Alerts enabled';
  notifyButton.disabled = true;
}

renderWatchlist();
renderAlerts();
setInterval(tick, TICK_MS);
