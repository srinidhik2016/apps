const chatWall = document.querySelector('#chat-wall');
const form = document.querySelector('#chat-form');
const input = document.querySelector('#message-input');
const STORAGE_KEY = 'recall-memories';

const WEEKDAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
const MONTH_LOOKUP = {};
MONTHS.forEach((month, index) => {
  MONTH_LOOKUP[month] = index;
  MONTH_LOOKUP[month.slice(0, 3)] = index;
});
const STOPWORDS = new Set(['what', 'did', 'do', 'does', 'when', 'who', 'where', 'why', 'how', 'remind', 'tell', 'you', 'about', 'remember', 'the', 'a', 'an', 'is', 'was', 'were', 'are', 'my', 'to', 'of', 'for', 'that', 'this', 'have', 'has', 'had', 'please', 'can', 'could', 'would', 'anything']);
const ACK_PHRASES = ['Noted. I’ll remember this for {date}.', 'Got it — saved under {date}.', 'Saved. You can ask me about this anytime.'];

function loadMemories() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch (error) {
    return [];
  }
}

function saveMemories() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
}

let memories = loadMemories();

function pad(value) {
  return String(value).padStart(2, '0');
}

function dateKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function startOfDay(date) {
  const clean = new Date(date);
  clean.setHours(0, 0, 0, 0);
  return clean;
}

function addDays(date, amount) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

function formatDateLabel(key) {
  const [year, month, day] = key.split('-').map(Number);
  return new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(year, month - 1, day));
}

function timeNow() {
  return new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date());
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function findWeekdayDate(name, wantsLast) {
  const target = WEEKDAYS.indexOf(name.toLowerCase());
  if (target === -1) return null;
  const today = startOfDay(new Date());
  let daysBack = (today.getDay() - target + 7) % 7;
  if (daysBack === 0) daysBack = wantsLast ? 7 : 0;
  else if (wantsLast) daysBack += 7;
  return addDays(today, -daysBack);
}

function findWeekdayQuery(text) {
  const match = text.match(/\b(last\s+)?(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/i);
  if (!match) return null;
  return findWeekdayDate(match[2], Boolean(match[1]));
}

function findDaysAgoDate(text) {
  const match = text.match(/\b(\d+)\s+days?\s+ago\b/i);
  if (!match) return null;
  return addDays(startOfDay(new Date()), -Number(match[1]));
}

function findMonthDayDate(text) {
  const match = text.match(/\b([a-z]+)\.?\s+(\d{1,2})(?:st|nd|rd|th)?(?:,?\s+(\d{4}))?\b/i);
  if (!match) return null;
  const monthIndex = MONTH_LOOKUP[match[1].toLowerCase()];
  if (monthIndex === undefined) return null;
  const day = Number(match[2]);
  if (day < 1 || day > 31) return null;
  const year = match[3] ? Number(match[3]) : new Date().getFullYear();
  return new Date(year, monthIndex, day);
}

function findNumericDate(text) {
  const match = text.match(/\b(\d{1,2})[/-](\d{1,2})(?:[/-](\d{2,4}))?\b/);
  if (!match) return null;
  const month = Number(match[1]) - 1;
  const day = Number(match[2]);
  if (month < 0 || month > 11 || day < 1 || day > 31) return null;
  const year = match[3] ? (match[3].length === 2 ? 2000 + Number(match[3]) : Number(match[3])) : new Date().getFullYear();
  return new Date(year, month, day);
}

function findWeekRange(text) {
  const today = startOfDay(new Date());
  const currentWeekStart = addDays(today, -today.getDay());
  if (/\blast week\b/.test(text)) {
    const start = addDays(currentWeekStart, -7);
    return { start, end: addDays(start, 6) };
  }
  if (/\bthis week\b/.test(text)) {
    return { start: currentWeekStart, end: today };
  }
  return null;
}

function resolveDateQuery(text) {
  const lower = text.toLowerCase();
  const range = findWeekRange(lower);
  if (range) return { type: 'range', start: range.start, end: range.end };
  if (/\btoday\b/.test(lower)) return { type: 'day', date: startOfDay(new Date()) };
  if (/\byesterday\b/.test(lower)) return { type: 'day', date: addDays(startOfDay(new Date()), -1) };
  const daysAgo = findDaysAgoDate(lower);
  if (daysAgo) return { type: 'day', date: daysAgo };
  const weekday = findWeekdayQuery(lower);
  if (weekday) return { type: 'day', date: weekday };
  const named = findMonthDayDate(text) || findNumericDate(text);
  if (named) return { type: 'day', date: startOfDay(named) };
  return null;
}

function extractKeywords(text) {
  return text.toLowerCase().replace(/[?.!,]/g, '').split(/\s+/).filter((word) => word.length > 2 && !STOPWORDS.has(word));
}

function isQuestion(text) {
  return /\?/.test(text) || /^\s*(what|when|did|do you|does|who|where|why|how|remind me|tell me)\b/i.test(text.trim());
}

function formatEntryList(entries) {
  return `<ul class="memory-list">${entries.map((entry) => `<li>${escapeHtml(entry.text)}</li>`).join('')}</ul>`;
}

function groupByDate(entries) {
  const groups = {};
  entries.forEach((entry) => {
    groups[entry.dateKey] = groups[entry.dateKey] || [];
    groups[entry.dateKey].push(entry);
  });
  return groups;
}

function respondForDay(date) {
  const key = dateKey(date);
  const label = formatDateLabel(key);
  const dayEntries = memories.filter((entry) => entry.dateKey === key);
  if (!dayEntries.length) {
    return `<span class="answer-title">Nothing saved for ${label}</span><p>Once you tell me about that day, I’ll remember it for next time.</p>`;
  }
  return `<span class="answer-title">${label}</span>${formatEntryList(dayEntries)}`;
}

function respondForRange(start, end) {
  const startKey = dateKey(start);
  const endKey = dateKey(end);
  const rangeEntries = memories.filter((entry) => entry.dateKey >= startKey && entry.dateKey <= endKey);
  if (!rangeEntries.length) {
    return '<span class="answer-title">Nothing saved for that week</span><p>Tell me about your days and I’ll keep track from now on.</p>';
  }
  const groups = groupByDate(rangeEntries);
  return Object.keys(groups).sort().map((key) => `<span class="answer-title">${formatDateLabel(key)}</span>${formatEntryList(groups[key])}`).join('');
}

function respondForKeywords(text) {
  const keywords = extractKeywords(text);
  const matches = keywords.length ? memories.filter((entry) => keywords.some((word) => entry.text.toLowerCase().includes(word))) : [];
  if (!matches.length) {
    return '<span class="answer-title">I couldn’t find that.</span><p>Try asking about a specific day, like “What did I do yesterday?”, or tell me something new to remember.</p>';
  }
  const groups = groupByDate(matches);
  const sections = Object.keys(groups).sort().reverse().map((key) => `<span class="answer-title">${formatDateLabel(key)}</span>${formatEntryList(groups[key])}`).join('');
  return `<p>Here’s what I found:</p>${sections}`;
}

function storeMemory(text) {
  const now = new Date();
  const key = dateKey(now);
  memories.push({ id: now.getTime(), dateKey: key, text, createdAt: now.toISOString() });
  saveMemories();
  const label = formatDateLabel(key);
  const phrase = ACK_PHRASES[Math.floor(Math.random() * ACK_PHRASES.length)].replace('{date}', label);
  return `<p>${escapeHtml(phrase)}</p>`;
}

function respond(text) {
  const trimmed = text.trim();
  if (/^(hi|hello|hey)\b/i.test(trimmed)) {
    return '<span class="answer-title">Hello! 👋</span><p>Tell me something about your day, or ask me about a day you already told me about.</p>';
  }
  if (/^help\b/i.test(trimmed)) {
    return '<span class="answer-title">Here’s how Recall works</span><p>Tell me things like “Today I fixed the printer at the office.” Later, ask things like “What did I do yesterday?”, “What happened last Monday?”, or “What did I do on August 10?”</p>';
  }
  if (isQuestion(trimmed)) {
    const dateQuery = resolveDateQuery(trimmed);
    if (dateQuery?.type === 'day') return respondForDay(dateQuery.date);
    if (dateQuery?.type === 'range') return respondForRange(dateQuery.start, dateQuery.end);
    return respondForKeywords(trimmed);
  }
  const rememberMatch = trimmed.match(/^remember\s+(?:that|this)\s*[:-]?\s*(.+)/i);
  return storeMemory(rememberMatch ? rememberMatch[1] : trimmed);
}

function addMessage(html, type) {
  const row = document.createElement('div');
  row.className = `message-row ${type}-row`;
  const avatar = type === 'assistant' ? '<div class="avatar small-avatar bot-avatar" aria-hidden="true">R</div>' : '';
  row.innerHTML = type === 'assistant'
    ? `${avatar}<div class="bubble assistant-bubble"><div>${html}</div><time>${timeNow()}</time></div>`
    : `<div class="bubble user-bubble"><div>${html}</div><time>${timeNow()}</time></div>`;
  chatWall.appendChild(row);
  chatWall.scrollTop = chatWall.scrollHeight;
}

function sendMessage(text) {
  addMessage(escapeHtml(text), 'user');
  const typing = document.createElement('div');
  typing.className = 'message-row assistant-row';
  typing.innerHTML = '<div class="avatar small-avatar bot-avatar" aria-hidden="true">R</div><div class="bubble assistant-bubble typing">Recall is checking...</div>';
  chatWall.appendChild(typing);
  chatWall.scrollTop = chatWall.scrollHeight;
  window.setTimeout(() => {
    typing.remove();
    addMessage(respond(text), 'assistant');
  }, 500);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  sendMessage(text);
});

document.querySelector('#clear-chat').addEventListener('click', () => {
  chatWall.innerHTML = '<div class="date-chip">NEW CHAT</div>';
  addMessage('<span class="answer-title">Fresh chat.</span><p>Your saved memories are still here — tell me something new or ask about a day.</p>', 'assistant');
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Force a check for the self-destructing worker so old cached devices clean up quickly.
    navigator.serviceWorker.getRegistration().then((registration) => registration?.update());
  });
}
