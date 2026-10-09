'use strict';

(() => {
  const API_URL = 'https://stendhal-analytics.aesopb15254.workers.dev/';
  const SESSION_KEY = 'stendhal_cf_analytics_token';
  const LOCAL_KEY = 'stendhal_cf_analytics_token_saved';
  const REFRESH_SECONDS = 60;

  const state = {
    token: null,
    range: '24h',
    fetching: false,
    lastFetchAt: 0,
    ticker: null
  };

  const $ = (id) => document.getElementById(id);
  const fmt = new Intl.NumberFormat('zh-HK');

  function setStatus(kind, text) {
    const dot = $('status-dot');
    dot.classList.toggle('is-live', kind === 'live');
    dot.classList.toggle('is-error', kind === 'error');
    $('status-text').textContent = text;
  }

  function readSavedToken() {
    return sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(LOCAL_KEY) || '';
  }

  function saveToken(token, remember) {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(LOCAL_KEY);
    if (remember) localStorage.setItem(LOCAL_KEY, token);
    else sessionStorage.setItem(SESSION_KEY, token);
  }

  function removeToken() {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(LOCAL_KEY);
    state.token = null;
  }

  function showSetup(message = '') {
    $('setup-card').hidden = false;
    $('analytics-content').hidden = true;
    $('api-error').hidden = true;
    $('form-error').hidden = !message;
    $('form-error').textContent = message;
    setStatus(message ? 'error' : 'idle', message ? 'Token 需要更新' : '未連接');
  }

  function showDashboard() {
    $('setup-card').hidden = true;
    $('analytics-content').hidden = false;
    $('form-error').hidden = true;
  }

  function showApiError(message) {
    $('api-error').hidden = false;
    $('api-error-message').textContent = message;
    setStatus('error', '讀取失敗');
  }

  function clearApiError() {
    $('api-error').hidden = true;
    $('api-error-message').textContent = '';
  }

  async function fetchAnalytics({ connecting = false } = {}) {
    if (!state.token || state.fetching) return false;
    state.fetching = true;
    clearApiError();
    setStatus('idle', connecting ? '驗證 Token…' : '更新中…');
    $('refresh-button').disabled = true;

    try {
      const response = await fetch(`${API_URL}?range=${encodeURIComponent(state.range)}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${state.token}` },
        cache: 'no-store'
      });

      let payload = null;
      try { payload = await response.json(); }
      catch { payload = {}; }

      if (!response.ok) {
        const message = payload.message || `HTTP ${response.status}`;
        if (response.status === 401 || response.status === 403) {
          if (!connecting) removeToken();
          showSetup(`Cloudflare 拒絕了這個 Token。請確認權限是 Account → Account Analytics → Read。${message ? `（${message}）` : ''}`);
          return false;
        }
        throw new Error(message);
      }

      render(payload);
      state.lastFetchAt = Date.now();
      showDashboard();
      setStatus('live', '已連接 · 自動更新');
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (connecting) {
        showSetup(`未能連接 Cloudflare Analytics：${message}`);
      } else {
        showApiError(message);
      }
      return false;
    } finally {
      state.fetching = false;
      $('refresh-button').disabled = false;
      updateCountdown();
    }
  }

  function render(data) {
    const pageViews = Number(data.summary?.pageViews || 0);
    const visits = Number(data.summary?.visits || 0);
    $('metric-pageviews').textContent = fmt.format(pageViews);
    $('metric-visits').textContent = fmt.format(visits);
    $('metric-ratio').textContent = visits > 0 ? (pageViews / visits).toFixed(2) : '—';

    const generated = data.generatedAt ? new Date(data.generatedAt) : new Date();
    $('last-updated').textContent = `最後更新 ${generated.toLocaleTimeString('zh-HK', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;

    renderChart(bucketTimeline(data.timeline || [], state.range));
    renderRank('country-list', data.countries || [], (label) => label || '未知地區');
    renderRank('referrer-list', data.referrers || [], (label) => label === 'Direct / unknown' ? '直接開啟／未知' : label);
    renderRank('device-list', data.devices || [], translateDevice);
    renderRank('browser-list', data.browsers || [], (label) => label || '未知瀏覽器');
  }

  function translateDevice(label) {
    const key = String(label || '').toLowerCase();
    const map = { desktop: '桌面電腦', mobile: '手機', tablet: '平板', bot: '機械流量' };
    return map[key] || label || '未知裝置';
  }

  function bucketTimeline(rows, range) {
    const grouped = new Map();
    for (const row of rows) {
      if (!row.time) continue;
      const d = new Date(row.time);
      if (Number.isNaN(d.getTime())) continue;
      let key;
      let label;
      if (range === '24h') {
        key = d.toISOString().slice(0, 13);
        label = d.toLocaleTimeString('zh-HK', { hour: '2-digit', minute: '2-digit' });
      } else {
        key = d.toISOString().slice(0, 10);
        label = d.toLocaleDateString('zh-HK', { month: 'numeric', day: 'numeric' });
      }
      const current = grouped.get(key) || { key, label, pageViews: 0 };
      current.pageViews += Number(row.pageViews || 0);
      grouped.set(key, current);
    }
    return [...grouped.values()].sort((a, b) => a.key.localeCompare(b.key));
  }

  function xml(text) {
    return String(text).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[char]));
  }

  function renderChart(points) {
    const svg = $('traffic-chart');
    const empty = $('empty-chart');
    if (!points.length || points.every((p) => p.pageViews === 0)) {
      svg.innerHTML = '';
      empty.hidden = false;
      return;
    }
    empty.hidden = true;

    const width = 760;
    const height = 240;
    const left = 42;
    const right = 14;
    const top = 18;
    const bottom = 36;
    const innerW = width - left - right;
    const innerH = height - top - bottom;
    const maxValue = Math.max(1, ...points.map((p) => p.pageViews));
    const x = (i) => left + (points.length === 1 ? innerW / 2 : (i / (points.length - 1)) * innerW);
    const y = (value) => top + innerH - (value / maxValue) * innerH;
    const coords = points.map((p, i) => [x(i), y(p.pageViews)]);
    const line = coords.map(([cx, cy]) => `${cx.toFixed(1)},${cy.toFixed(1)}`).join(' ');
    const area = `M ${coords[0][0].toFixed(1)} ${top + innerH} L ${coords.map(([cx, cy]) => `${cx.toFixed(1)} ${cy.toFixed(1)}`).join(' L ')} L ${coords.at(-1)[0].toFixed(1)} ${top + innerH} Z`;

    const grid = [0, .5, 1].map((ratio) => {
      const gy = top + innerH - ratio * innerH;
      const value = Math.round(maxValue * ratio);
      return `<line class="chart-grid" x1="${left}" y1="${gy}" x2="${width - right}" y2="${gy}"></line><text class="chart-value" x="${left - 8}" y="${gy + 4}" text-anchor="end">${fmt.format(value)}</text>`;
    }).join('');

    const indices = [...new Set([0, Math.floor((points.length - 1) / 2), points.length - 1])];
    const labels = indices.map((i) => `<text class="chart-label" x="${x(i)}" y="${height - 8}" text-anchor="${i === 0 ? 'start' : i === points.length - 1 ? 'end' : 'middle'}">${xml(points[i].label)}</text>`).join('');
    const dots = coords.map(([cx, cy], i) => points.length <= 14 || i === points.length - 1 ? `<circle class="chart-dot" cx="${cx}" cy="${cy}" r="3.8"><title>${xml(points[i].label)}：${fmt.format(points[i].pageViews)}</title></circle>` : '').join('');

    svg.innerHTML = `<defs><linearGradient id="traffic-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#7b3f45" stop-opacity=".22"></stop><stop offset="100%" stop-color="#7b3f45" stop-opacity="0"></stop></linearGradient></defs>${grid}<path class="chart-area" d="${area}"></path><polyline class="chart-line" points="${line}"></polyline>${dots}${labels}`;
  }

  function renderRank(id, items, labelTransform) {
    const host = $(id);
    host.textContent = '';
    if (!items.length) {
      const p = document.createElement('p');
      p.className = 'rank-empty';
      p.textContent = '暫時未有資料。';
      host.appendChild(p);
      return;
    }

    const total = items.reduce((sum, item) => sum + Number(item.pageViews || 0), 0) || 1;
    const max = Math.max(...items.map((item) => Number(item.pageViews || 0)), 1);
    for (const item of items) {
      const value = Number(item.pageViews || 0);
      const row = document.createElement('div');
      row.className = 'rank-row';

      const meta = document.createElement('div');
      meta.className = 'rank-meta';
      const labels = document.createElement('div');
      labels.className = 'rank-labels';
      const label = document.createElement('span');
      label.className = 'rank-label';
      label.textContent = labelTransform(item.label);
      const share = document.createElement('span');
      share.className = 'rank-share';
      share.textContent = `${Math.round((value / total) * 100)}%`;
      labels.append(label, share);

      const track = document.createElement('div');
      track.className = 'rank-track';
      const fill = document.createElement('div');
      fill.className = 'rank-fill';
      fill.style.width = `${Math.max(2, (value / max) * 100)}%`;
      track.appendChild(fill);
      meta.append(labels, track);

      const count = document.createElement('span');
      count.className = 'rank-value';
      count.textContent = fmt.format(value);
      row.append(meta, count);
      host.appendChild(row);
    }
  }

  function updateCountdown() {
    const el = $('metric-countdown');
    if (!el) return;
    if (!state.token || !state.lastFetchAt) {
      el.textContent = '60s';
      return;
    }
    const elapsed = Math.floor((Date.now() - state.lastFetchAt) / 1000);
    const left = Math.max(0, REFRESH_SECONDS - elapsed);
    el.textContent = `${left}s`;
    if (left === 0 && !state.fetching && document.visibilityState === 'visible') fetchAnalytics();
  }

  async function connect(token, remember) {
    state.token = token.trim();
    if (!state.token) return;
    const ok = await fetchAnalytics({ connecting: true });
    if (ok) {
      saveToken(state.token, remember);
      $('token-input').value = '';
    } else if (!$('analytics-content').hidden) {
      showSetup('Token 驗證失敗。');
    }
  }

  function activateRange(range) {
    state.range = range;
    document.querySelectorAll('.range-button').forEach((button) => button.classList.toggle('is-active', button.dataset.range === range));
    if (state.token) fetchAnalytics();
  }

  function bindEvents() {
    $('token-form').addEventListener('submit', (event) => {
      event.preventDefault();
      connect($('token-input').value, $('remember-token').checked);
    });
    $('refresh-button').addEventListener('click', () => fetchAnalytics());
    $('disconnect-button').addEventListener('click', () => {
      removeToken();
      state.lastFetchAt = 0;
      $('token-input').value = '';
      $('remember-token').checked = false;
      showSetup();
    });
    document.querySelectorAll('.range-button').forEach((button) => button.addEventListener('click', () => activateRange(button.dataset.range)));
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && state.token) fetchAnalytics();
    });
  }

  async function init() {
    bindEvents();
    state.ticker = window.setInterval(updateCountdown, 1000);
    const saved = readSavedToken();
    if (!saved) {
      showSetup();
      return;
    }
    state.token = saved;
    const ok = await fetchAnalytics({ connecting: true });
    if (!ok && state.token) showSetup('已儲存的 Token 未能通過驗證，請重新輸入。');
  }

  init();
})();
