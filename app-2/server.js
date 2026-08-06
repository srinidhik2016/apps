const http = require('http');
const fs = require('fs');
const path = require('path');

const rootDir = '/workspaces/apps';
const port = process.env.PORT || 3000;
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
  const response = await fetch(llmUrl, {
    method: 'POST',
    headers: llmHeaders,
    body: JSON.stringify({
      model: 'class-chat-model',
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    throw new Error(`LLM request failed: ${response.status}`);
  }

  const data = await response.json();
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
          const prompt = `Translate this English word into ${targetLanguage}. Return only the translated word and nothing else. Word: ${word}`;
          const reply = await callLlm(prompt);
          const translatedText = reply.trim().replace(/^['"]|['"]$/g, '');
          sendJson(res, 200, { translatedText });
        } catch (err) {
          sendJson(res, 500, { error: err.message });
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
          const prompt = `Create 3 short example sentences in ${languageName || targetLanguage} using the word "${translatedWord}". Keep them very simple and add a short English meaning after each sentence.`;
          const reply = await callLlm(prompt);
          sendJson(res, 200, { content: reply.trim() });
        } catch (err) {
          sendJson(res, 500, { error: err.message });
        }
      });
      return;
    }

    let requestPath = req.url.split('?')[0];
    if (requestPath === '/') {
      requestPath = '/app-2/index.html';
    }

    if (requestPath === '/app-2' || requestPath === '/app-2/') {
      requestPath = '/app-2/index.html';
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

server.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}`);
});
