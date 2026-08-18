const http = require('http');
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';
const llmUrl = 'https://vibe-proxy-gqv4.onrender.com/v1/chat/completions';

const llmHeaders = {
  'Content-Type': 'application/json',
  Authorization: 'Bearer sk-vibe-summer-2026'
};

const languageNames = {
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  ja: 'Japanese',
  ko: 'Korean',
  hi: 'Hindi',
  ta: 'Tamil'
};

function getLanguageName(targetLanguage) {
  return languageNames[targetLanguage] || targetLanguage || 'the selected language';
}

const fallbackTranslations = {
  hello: {
    es: 'hola',
    fr: 'bonjour',
    de: 'hallo',
    it: 'ciao',
    pt: 'olá',
    ja: 'こんにちは',
    ko: '안녕하세요',
    hi: 'नमस्ते',
    ta: 'வணக்கம்'
  },
  thank: {
    es: 'gracias',
    fr: 'merci',
    de: 'danke',
    it: 'grazie',
    pt: 'obrigado',
    ja: 'ありがとうございます',
    ko: '감사합니다',
    hi: 'धन्यवाद',
    ta: 'நன்றி'
  },
  love: {
    es: 'amor',
    fr: 'amour',
    de: 'liebe',
    it: 'amore',
    pt: 'amor',
    ja: '愛',
    ko: '사랑',
    hi: 'प्यार',
    ta: 'அன்பு'
  },
  friend: {
    es: 'amigo',
    fr: 'ami',
    de: 'freund',
    it: 'amico',
    pt: 'amigo',
    ja: '友達',
    ko: '친구',
    hi: 'दोस्त',
    ta: 'நண்பன்'
  }
};

function getFallbackTranslation(word, targetLanguage) {
  const key = String(word || '').trim().toLowerCase();
  return fallbackTranslations[key]?.[targetLanguage] || null;
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html': return 'text/html; charset=utf-8';
    case '.css': return 'text/css; charset=utf-8';
    case '.js': return 'application/javascript; charset=utf-8';
    case '.json': return 'application/json; charset=utf-8';
    case '.png': return 'image/png';
    case '.jpg': return 'image/jpeg';
    case '.svg': return 'image/svg+xml';
    default: return 'application/octet-stream';
  }
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(payload));
}

function serveStaticFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }

    res.writeHead(200, { 'Content-Type': getContentType(filePath) });
    res.end(data);
  });
}

async function callLlm(prompt) {
  console.log('[llm] Started LLM call');
  const response = await fetch(llmUrl, {
    method: 'POST',
    headers: llmHeaders,
    body: JSON.stringify({
      model: 'class-chat-model',
      messages: [{ role: 'user', content: prompt }]
    })
  });

  console.log(`[llm] LLM returned status: ${response.status}`);
  const rawText = await response.text();
  console.log(`[llm] Raw return: ${rawText}`);

  if (!response.ok) {
    console.log('[llm] LLM returned failure');
    throw new Error(`LLM request failed: ${response.status}`);
  }

  console.log('[llm] LLM returned success');

  let data;
  try {
    data = JSON.parse(rawText);
  } catch (err) {
    throw new Error(`Failed to parse LLM JSON: ${err.message}`);
  }

  return data.choices?.[0]?.message?.content || '';
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      res.end();
      return;
    }

    if (req.method === 'POST' && req.url === '/api/translate') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', async () => {
        try {
          const { word, targetLanguage } = JSON.parse(body);
          const languageName = getLanguageName(targetLanguage);
          console.log(`[translate] Incoming request for word="${word}" targetLanguage="${targetLanguage}"`);
          const prompt = `Translate this English word into ${languageName}. Return only the translated word and nothing else. Word: ${word}`;
          const reply = await callLlm(prompt);
          const translatedText = reply.trim().replace(/^['"]|['"]$/g, '');
          console.log(`[translate] LLM return: ${translatedText}`);
          console.log('[translate] Fallback used: no');
          sendJson(res, 200, { translatedText });
        } catch (err) {
          console.error('[translate] LLM request failed, falling back to local translation:', err.message);
          const { word, targetLanguage } = JSON.parse(body);
          const fallback = word && targetLanguage ? getFallbackTranslation(word, targetLanguage) || word : word;
          console.log(`[translate] LLM returned failure: ${err.message}`);
          console.log(`[translate] Fallback used: yes`);
          console.log(`[translate] Fallback outcome: ${fallback}`);
          sendJson(res, 200, { translatedText: fallback });
        }
      });
      return;
    }

    if (req.method === 'POST' && req.url === '/api/examples') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', async () => {
        try {
          const { translatedWord, targetLanguage, languageName } = JSON.parse(body);
          const resolvedLanguageName = languageName || getLanguageName(targetLanguage);
          console.log(`[examples] Incoming request for word="${translatedWord}" targetLanguage="${targetLanguage}"`);
          const prompt = `Create 3 short example sentences in ${resolvedLanguageName} using the word "${translatedWord}". Keep them very simple and add a short English meaning after each sentence.`;
          const reply = await callLlm(prompt);
          console.log(`[examples] LLM return: ${reply}`);
          console.log('[examples] Fallback used: no');
          sendJson(res, 200, { content: reply.trim() });
        } catch (err) {
          console.error('[examples] LLM request failed, falling back to local example text:', err.message);
          const { translatedWord } = JSON.parse(body);
          const fallback = `Example: "${translatedWord}" means ${translatedWord}.`;
          console.log(`[examples] LLM returned failure: ${err.message}`);
          console.log('[examples] Fallback used: yes');
          console.log(`[examples] Fallback outcome: ${fallback}`);
          sendJson(res, 200, { content: fallback });
        }
      });
      return;
    }

    let requestPath = req.url.split('?')[0];
    if (requestPath === '/' || requestPath === '') {
      requestPath = '/index.html';
    } else if (requestPath === '/app-1' || requestPath === '/app-1/') {
      requestPath = '/app-1/index.html';
    } else if (requestPath === '/app-2' || requestPath === '/app-2/') {
      requestPath = '/app-2/index.html';
    } else if (requestPath === '/app-3' || requestPath === '/app-3/') {
      requestPath = '/app-3/index.html';
    } else if (requestPath === '/app-4' || requestPath === '/app-4/') {
      requestPath = '/app-4/index.html';
    } else if (requestPath === '/styles.css') {
      requestPath = '/app-2/styles.css';
    } else if (requestPath === '/app.js') {
      requestPath = '/app-2/app.js';
    }

    const filePath = path.join(rootDir, requestPath);
    if (!filePath.startsWith(rootDir)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Forbidden');
      return;
    }

    serveStaticFile(res, filePath);
  } catch (err) {
    sendJson(res, 500, { error: err.message });
  }
});

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});
