const http = require('http');
const fs = require('fs');
const path = require('path');

const rootDir = '/workspaces/apps';
const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';
const llmUrl = 'https://vibe-proxy-gqv4.onrender.com/v1/chat/completions';
const llmHeaders = {
  'Content-Type': 'application/json',
  Authorization: 'Bearer sk-vibe-summer-2026'
};

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
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
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
  console.log('[llm] Sending request to external API');
  const response = await fetch(llmUrl, {
    method: 'POST',
    headers: llmHeaders,
    body: JSON.stringify({
      model: 'class-chat-model',
      messages: [{ role: 'user', content: prompt }]
    })
  });

  console.log(`[llm] Response status: ${response.status}`);
  const rawText = await response.text();
  console.log(`[llm] Raw response: ${rawText}`);

  if (!response.ok) {
    throw new Error(`LLM request failed: ${response.status}`);
  }

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
    if (req.method === 'POST' && req.url === '/api/translate') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', async () => {
        try {
          const { word, targetLanguage } = JSON.parse(body);
          console.log(`[translate] Incoming request for word="${word}" targetLanguage="${targetLanguage}"`);
          const prompt = `Translate this English word into ${targetLanguage}. Return only the translated word and nothing else. Word: ${word}`;
          const reply = await callLlm(prompt);
          const translatedText = reply.trim().replace(/^['"]|['"]$/g, '');
          console.log(`[translate] LLM reply: ${translatedText}`);
          sendJson(res, 200, { translatedText });
        } catch (err) {
          console.error('[translate] LLM request failed, falling back to local translation:', err.message);
          const { word, targetLanguage } = JSON.parse(body);
          const fallback = word && targetLanguage ? getFallbackTranslation(word, targetLanguage) || word : word;
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
          console.log(`[examples] Incoming request for word="${translatedWord}" targetLanguage="${targetLanguage}"`);
          const prompt = `Create 3 short example sentences in ${languageName || targetLanguage} using the word "${translatedWord}". Keep them very simple and add a short English meaning after each sentence.`;
          const reply = await callLlm(prompt);
          console.log(`[examples] LLM reply: ${reply}`);
          sendJson(res, 200, { content: reply.trim() });
        } catch (err) {
          console.error('[examples] LLM request failed, falling back to local example text:', err.message);
          const { translatedWord } = JSON.parse(body);
          const fallback = `Example: "${translatedWord}" means ${translatedWord}.`;
          sendJson(res, 200, { content: fallback });
        }
      });
      return;
    }

    let requestPath = req.url.split('?')[0];
    if (requestPath === '/' || requestPath === '') {
      requestPath = '/index.html';
    } else if (requestPath === '/app-2' || requestPath === '/app-2/') {
      requestPath = '/app-2/index.html';
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
