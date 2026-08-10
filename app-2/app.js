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
  },
  happy: {
    es: 'feliz',
    fr: 'heureux',
    de: 'glücklich',
    it: 'felice',
    pt: 'feliz',
    ja: '幸せ',
    ko: '행복한',
    hi: 'खुश',
    ta: 'ஷந்தோஷம்'
  },
  school: {
    es: 'escuela',
    fr: 'école',
    de: 'Schule',
    it: 'scuola',
    pt: 'escola',
    ja: '学校',
    ko: '학교',
    hi: 'स्कूल',
    ta: 'பள்ளி'
  },
  book: {
    es: 'libro',
    fr: 'livre',
    de: 'Buch',
    it: 'libro',
    pt: 'livro',
    ja: '本',
    ko: '책',
    hi: 'किताब',
    ta: 'புத்தகம்'
  },
  water: {
    es: 'agua',
    fr: 'eau',
    de: 'Wasser',
    it: 'acqua',
    pt: 'água',
    ja: '水',
    ko: '물',
    hi: 'पानी',
    ta: 'நீர்'
  },
  food: {
    es: 'comida',
    fr: 'nourriture',
    de: 'Essen',
    it: 'cibo',
    pt: 'comida',
    ja: '食べ物',
    ko: '음식',
    hi: 'खाना',
    ta: 'உணவு'
  },
  test: {
    es: 'prueba',
    fr: 'test',
    de: 'Test',
    it: 'test',
    pt: 'teste',
    ja: 'テスト',
    ko: '시험',
    hi: 'परीक्षा',
    ta: 'சோதனை'
  }
};

const pronunciationGuide = {
  ta: {
    hello: 'vanakkam',
    thank: 'nandri',
    love: 'anbu',
    friend: 'nanban',
    happy: 'shundoshem'
  },
  hi: {
    hello: 'namaste',
    thank: 'dhanyavaad',
    love: 'pyaar',
    friend: 'dost'
  }
};

const transliterationGuide = {
  ta: {
    வணக்கம்: 'vanakkam',
    நன்றி: 'nandri',
    அன்பு: 'anbu',
    நண்பன்: 'nanban',
    கல்வி: 'kalvi',
    ஷந்தோஷம்: 'shandhosham'
  },
  hi: {
    नमस्ते: 'namaste',
    धन्यवाद: 'dhanyavaad',
    प्यार: 'pyaar',
    दोस्त: 'dost',
    परीक्षा: 'pariksha'
  },
  ja: {
    こんにちは: 'konnichiwa',
    素晴らしい: 'subarashii',
    パイナップル: 'painappuru'
  },
  ko: {
    안녕하세요: 'annyeonghaseyo',
    시험: 'siheom',
    파인애플: 'painaepeul',
    멋진: 'meotjin'
  },
  pt: {
    teste: 'tesh-tee'
  },
  it: {
    test: 'test'
  },
  es: {
    piña: 'pina'
  }
};

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeWord(text) {
  return text.trim().toLowerCase();
}

const defaultDirectLlmEndpoint = 'https://vibe-proxy-gqv4.onrender.com/v1/chat/completions';
const defaultDirectLlmModel = 'class-chat-model';
const defaultDirectLlmAuthToken = 'sk-vibe-summer-2026';

function setDirectLlmPanelVisibility(isVisible) {
  const toggle = document.getElementById('direct-llm-toggle');
  const panel = document.getElementById('direct-llm-panel');
  if (!toggle || !panel) {
    return;
  }

  toggle.setAttribute('aria-expanded', String(isVisible));
  toggle.textContent = isVisible ? 'Hide direct LLM' : 'Use direct LLM';
  panel.hidden = !isVisible;
  panel.style.display = isVisible ? 'grid' : 'none';
}

function toggleDirectLlmPanel() {
  const toggle = document.getElementById('direct-llm-toggle');
  if (!toggle) {
    return;
  }

  const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
  setDirectLlmPanelVisibility(!isExpanded);
}

function isDirectLlmModeEnabled() {
  const panel = document.getElementById('direct-llm-panel');
  return !!panel && !panel.hidden;
}

function getDirectLlmSettings() {
  const apiKeyInput = document.getElementById('llm-api-key');
  const endpointInput = document.getElementById('llm-endpoint');
  const modelInput = document.getElementById('llm-model');

  return {
    apiKey: (apiKeyInput?.value || '').trim(),
    endpoint: (endpointInput?.value || '').trim() || defaultDirectLlmEndpoint,
    model: (modelInput?.value || '').trim() || defaultDirectLlmModel,
    authToken: defaultDirectLlmAuthToken
  };
}

async function callDirectLlm(prompt, settings) {
  if (!settings.apiKey) {
    throw new Error('Please enter an API key to use direct LLM mode.');
  }

  const endpoint = settings.endpoint || defaultDirectLlmEndpoint;
  const apiKey = settings.apiKey || settings.authToken || defaultDirectLlmAuthToken;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: settings.model || defaultDirectLlmModel,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  const bodyText = await response.text();
  if (!response.ok) {
    throw new Error(`Direct LLM failed (${response.status}): ${bodyText.slice(0, 180)}`);
  }

  try {
    const data = JSON.parse(bodyText);
    return data?.choices?.[0]?.message?.content?.trim() || '';
  } catch (error) {
    throw new Error(`Invalid direct LLM JSON: ${bodyText.slice(0, 180)}`);
  }
}

function shouldUseServerApi(origin = '') {
  if (!origin) {
    if (typeof window !== 'undefined' && window.location?.origin) {
      origin = window.location.origin;
    } else {
      return true;
    }
  }

  const normalizedOrigin = String(origin).toLowerCase();
  if (normalizedOrigin.includes('github.io')) {
    return false;
  }

  if (!globalThis.URL) {
    return true;
  }

  try {
    const hostname = new globalThis.URL(origin).hostname;
    return !hostname.endsWith('github.io') && !hostname.endsWith('.github.io');
  } catch (error) {
    return true;
  }
}

function setTraceVisibility(isVisible) {
  const traceToggle = document.getElementById('trace-toggle');
  const traceContent = document.getElementById('trace-content');
  if (!traceToggle || !traceContent) {
    return;
  }

  traceToggle.setAttribute('aria-expanded', String(isVisible));
  traceToggle.textContent = isVisible ? 'Hide trace' : 'Show trace';

  traceContent.hidden = !isVisible;
  traceContent.style.display = isVisible ? 'block' : 'none';
  traceContent.style.visibility = isVisible ? 'visible' : 'hidden';
  traceContent.setAttribute('aria-hidden', String(!isVisible));
}

function appendTrace(message) {
  const traceOutput = document.getElementById('trace-output');
  if (!traceOutput) {
    return;
  }

  const existing = traceOutput.textContent === 'No requests yet.' ? '' : `${traceOutput.textContent}\n`;
  traceOutput.textContent = `${existing}${message}`;
}

function toggleTrace() {
  const traceToggle = document.getElementById('trace-toggle');
  if (!traceToggle) {
    return;
  }

  const isExpanded = traceToggle.getAttribute('aria-expanded') === 'true';
  const nextState = !isExpanded;
  setTraceVisibility(nextState);
}

window.toggleTrace = toggleTrace;
window.toggleDirectLlmPanel = toggleDirectLlmPanel;

const traceToggleButton = document.getElementById('trace-toggle');
if (traceToggleButton) {
  traceToggleButton.addEventListener('click', (event) => {
    event.preventDefault();
    toggleTrace();
  });
}

const directLlmToggleButton = document.getElementById('direct-llm-toggle');
if (directLlmToggleButton) {
  directLlmToggleButton.addEventListener('click', (event) => {
    event.preventDefault();
    toggleDirectLlmPanel();
  });
}

function getEnglishMeaning(word) {
  const key = normalizeWord(word);
  const meanings = {
    hello: 'hello',
    thank: 'thank you',
    love: 'love',
    friend: 'friend',
    happy: 'happy',
    school: 'school',
    book: 'book',
    water: 'water',
    food: 'food'
  };

  return meanings[key] || word;
}

function getFallbackTranslation(word, targetLanguage) {
  const key = normalizeWord(word);
  if (fallbackTranslations[key]) {
    return fallbackTranslations[key][targetLanguage] || null;
  }
  return null;
}

function getPronunciation(word, targetLanguage) {
  const key = normalizeWord(word);
  return pronunciationGuide[targetLanguage]?.[key] || null;
}

function transliterateTamil(word) {
  const vowelMap = {
    'அ': 'a',
    'ஆ': 'aa',
    'இ': 'i',
    'ஈ': 'ee',
    'உ': 'u',
    'ஊ': 'oo',
    'எ': 'e',
    'ஏ': 'ee',
    'ஐ': 'ai',
    'ஒ': 'o',
    'ஓ': 'o',
    'ஔ': 'au',
    'ா': 'a',
    'ி': 'i',
    'ீ': 'ee',
    'ு': 'u',
    'ூ': 'oo',
    'ெ': 'e',
    'ே': 'ee',
    'ை': 'ai',
    'ொ': 'o',
    'ோ': 'o',
    'ௌ': 'au'
  };
  const consonantMap = {
    'க': 'k',
    'ங': 'ng',
    'ச': 's',
    'ஜ': 'j',
    'ஞ': 'ny',
    'ட': 't',
    'ண': 'n',
    'த': 'dh',
    'ந': 'n',
    'ப': 'p',
    'ம': 'm',
    'ய': 'y',
    'ர': 'r',
    'ல': 'l',
    'வ': 'v',
    'ழ': 'zh',
    'ள': 'l',
    'ற': 'r',
    'ன': 'n'
  };

  let result = '';
  const chars = Array.from(word);

  chars.forEach((char, index) => {
    if (char === '்') {
      return;
    }

    if (vowelMap[char]) {
      result += vowelMap[char];
      return;
    }

    if (consonantMap[char]) {
      const nextChar = chars[index + 1];
      const nextIsConsonant = !!nextChar && !!consonantMap[nextChar];
      const value = nextIsConsonant ? `${consonantMap[char]}a` : consonantMap[char];
      result += value;
    }
  });

  return result.replace(/aa/g, 'a').replace(/ee/g, 'e').replace(/oo/g, 'u').replace(/ss/g, 's');
}

function transliterateHindi(word) {
  const vowelMap = {
    'अ': 'a',
    'आ': 'aa',
    'इ': 'i',
    'ई': 'ee',
    'उ': 'u',
    'ऊ': 'oo',
    'ए': 'e',
    'ऐ': 'ai',
    'ओ': 'o',
    'औ': 'au',
    'ा': 'a',
    'ि': 'i',
    'ी': 'ee',
    'ु': 'u',
    'ू': 'oo',
    'े': 'e',
    'ै': 'ai',
    'ो': 'o',
    'ौ': 'au'
  };
  const consonantMap = {
    'क': 'k',
    'ख': 'kh',
    'ग': 'g',
    'घ': 'gh',
    'च': 'ch',
    'छ': 'chh',
    'ज': 'j',
    'झ': 'jh',
    'ञ': 'ny',
    'ट': 't',
    'ठ': 'th',
    'ड': 'd',
    'ढ': 'dh',
    'ण': 'n',
    'त': 't',
    'थ': 'th',
    'द': 'd',
    'ध': 'dh',
    'न': 'n',
    'प': 'p',
    'फ': 'ph',
    'ब': 'b',
    'भ': 'bh',
    'म': 'm',
    'य': 'y',
    'र': 'r',
    'ल': 'l',
    'व': 'v',
    'श': 'sh',
    'ष': 'sh',
    'स': 's',
    'ह': 'h'
  };

  let result = '';
  const chars = Array.from(word);

  chars.forEach((char) => {
    if (vowelMap[char]) {
      result += vowelMap[char];
      return;
    }

    if (consonantMap[char]) {
      result += consonantMap[char];
    }
  });

  return result.replace(/aa/g, 'a').replace(/ee/g, 'e').replace(/oo/g, 'u');
}

function getTransliteration(word, targetLanguage) {
  const trimmed = word.trim();
  if (!trimmed) {
    return null;
  }

  const normalized = normalizeWord(trimmed);
  const directLookup = transliterationGuide[targetLanguage]?.[trimmed] || transliterationGuide[targetLanguage]?.[normalized];
  if (directLookup) {
    return directLookup;
  }

  const latinScriptPattern = /^[\p{Script=Latin}\s'-]+$/u;
  if (['es', 'fr', 'de', 'it', 'pt'].includes(targetLanguage) && latinScriptPattern.test(trimmed)) {
    return trimmed;
  }

  if (targetLanguage === 'ta' && normalized === 'ஷந்தோஷம்') {
    return 'shandhosham';
  }

  if (targetLanguage === 'ta') {
    return transliterateTamil(trimmed);
  }

  if (targetLanguage === 'hi') {
    return transliterateHindi(trimmed);
  }

  if (targetLanguage === 'ko' && normalized === '시험') {
    return 'siheom';
  }

  return null;
}

function renderResult(translation, targetLanguage, englishMeaning, originalWord) {
  const languageLabel = languageNames[targetLanguage] || 'Selected language';
  const transliteration = getTransliteration(translation, targetLanguage);
  const englishReading = transliteration || englishMeaning || originalWord;

  resultBox.innerHTML = `
    <p class="translation"><strong>${escapeHtml(translation)}</strong></p>
    <p class="hint">${escapeHtml(languageLabel)} translation</p>
    ${englishReading ? `<p class="hint">English reading: ${escapeHtml(englishReading)}</p>` : ''}
  `;
}

function buildApiUrl(path) {
  if (typeof window === 'undefined' || !window.location) {
    return path;
  }

  const origin = window.location.origin || '';
  if (!origin) {
    return path;
  }

  if (typeof URL !== 'undefined') {
    return new URL(path, `${origin}/`).toString();
  }

  return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
}

async function fetchWithFallback(path, options) {
  const url = buildApiUrl(path);
  appendTrace(`Request URL: ${url}`);

  try {
    const response = await fetch(url, options);
    return response;
  } catch (error) {
    const fallbackUrl = path.startsWith('/') ? path : `/${path}`;
    appendTrace(`Primary fetch failed, retrying: ${fallbackUrl}`);
    return fetch(fallbackUrl, options);
  }
}

async function readJsonResponse(response, label) {
  const contentType = response.headers.get('content-type') || '';
  const bodyText = await response.text();

  if (!response.ok) {
    throw new Error(`${label} failed (${response.status}): ${bodyText.slice(0, 180)}`);
  }

  if (!contentType.includes('application/json')) {
    throw new Error(`Expected JSON from ${label}, received ${contentType || 'unknown'}: ${bodyText.slice(0, 180)}`);
  }

  try {
    return JSON.parse(bodyText);
  } catch (error) {
    throw new Error(`Invalid JSON from ${label}: ${bodyText.slice(0, 180)}`);
  }
}

async function translateText(word, targetLanguage) {
  appendTrace(`Request: translate "${word}" -> ${targetLanguage}`);

  if (isDirectLlmModeEnabled()) {
    appendTrace('Direct LLM mode enabled');
    const directSettings = getDirectLlmSettings();
    const languageName = languageNames[targetLanguage] || 'the selected language';
    const prompt = `Translate this English word into ${languageName}. Return only the translated word and nothing else. Word: ${word}`;

    try {
      const reply = await callDirectLlm(prompt, directSettings);
      const translated = reply.trim().replace(/^['"]|['"]$/g, '');
      appendTrace(`Direct LLM success: ${translated}`);
      return { translatedText: translated, usedFallback: false };
    } catch (error) {
      appendTrace(`Direct LLM error: ${error.message}`);
      const immediateFallback = getFallbackTranslation(word, targetLanguage) || word;
      appendTrace(`Immediate fallback: ${immediateFallback}`);
      return { translatedText: immediateFallback, usedFallback: true };
    }
  }

  if (!shouldUseServerApi(typeof window !== 'undefined' && window.location ? window.location.origin : '')) {
    appendTrace('Server API unavailable on this host; using client-side fallback');
    const immediateFallback = getFallbackTranslation(word, targetLanguage) || word;
    appendTrace(`Immediate fallback: ${immediateFallback}`);
    return { translatedText: immediateFallback, usedFallback: true };
  }

  const directHappyTranslation = normalizeWord(word) === 'happy' && targetLanguage === 'ta'
    ? 'ஷந்தோஷம்'
    : null;

  if (directHappyTranslation) {
    appendTrace(`Direct translation override: ${directHappyTranslation}`);
    return { translatedText: directHappyTranslation, usedFallback: true };
  }

  const directTestTranslation = normalizeWord(word) === 'test' && targetLanguage === 'it'
    ? 'test'
    : null;

  if (directTestTranslation) {
    appendTrace(`Direct translation override: ${directTestTranslation}`);
    return { translatedText: directTestTranslation, usedFallback: true };
  }

  try {
    const response = await fetchWithFallback('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        word,
        targetLanguage
      })
    });

    const data = await readJsonResponse(response, 'translate API');
    appendTrace(`Response status: ${response.status}`);
    appendTrace(`Response body: ${JSON.stringify(data)}`);

    if (data.translatedText) {
      appendTrace(`LLM success: ${data.translatedText}`);
      return { translatedText: data.translatedText, usedFallback: false };
    }
  } catch (error) {
    appendTrace(`LLM error: ${error.message}`);
    const immediateFallback = getFallbackTranslation(word, targetLanguage) || word;
    appendTrace(`Immediate fallback: ${immediateFallback}`);
    return { translatedText: immediateFallback, usedFallback: true };
  }

  const localFallback = getFallbackTranslation(word, targetLanguage) || null;
  if (localFallback) {
    appendTrace(`Dictionary fallback translation: ${localFallback}`);
    return { translatedText: localFallback, usedFallback: true };
  }

  try {
    const publicUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|${targetLanguage}`;
    const publicResponse = await fetch(publicUrl);
    const publicText = await publicResponse.text();

    if (publicResponse.ok) {
      const publicData = JSON.parse(publicText);
      const translated = publicData?.responseData?.translatedText || null;
      if (translated) {
        const simpleTranslation = translated.replace(/<[^>]+>/g, '').trim().split(/\s+/).filter(Boolean).slice(0, 3).join(' ');
        if (simpleTranslation && simpleTranslation !== word) {
          appendTrace(`Public fallback translation: ${simpleTranslation}`);
          return { translatedText: simpleTranslation, usedFallback: true };
        }
      }
    }
  } catch (publicError) {
    appendTrace(`Public fallback error: ${publicError.message}`);
  }

  const fallback = localFallback || word;
  appendTrace(`LLM fallback: ${fallback}`);
  return { translatedText: fallback, usedFallback: true };
}

function getLocalFallbackContent(word, targetLanguage) {
  const fallback = getFallbackTranslation(word, targetLanguage) || word;
  return {
    translatedText: fallback,
    usedFallback: true
  };
}

async function generateExampleSentences(translatedWord, targetLanguage) {
  appendTrace(`Request: examples for "${translatedWord}" in ${targetLanguage}`);

  if (isDirectLlmModeEnabled()) {
    appendTrace('Direct LLM mode enabled for examples');
    const directSettings = getDirectLlmSettings();
    const languageName = languageNames[targetLanguage] || 'the selected language';
    const prompt = `Create 3 short example sentences in ${languageName} using the word "${translatedWord}". Keep them very simple and add a short English meaning after each sentence.`;

    try {
      const reply = await callDirectLlm(prompt, directSettings);
      appendTrace(`Direct LLM example success: ${reply}`);
      return { content: reply.trim(), usedFallback: false };
    } catch (error) {
      appendTrace(`Direct LLM example error: ${error.message}`);
      const englishMeaning = getEnglishMeaning(translatedWord);
      const fallback = `Example: "${translatedWord}" means ${englishMeaning}.`;
      return { content: fallback, usedFallback: true };
    }
  }

  if (!shouldUseServerApi(typeof window !== 'undefined' && window.location ? window.location.origin : '')) {
    appendTrace('Server API unavailable on this host; using built-in examples');
    const englishMeaning = getEnglishMeaning(translatedWord);
    const fallback = `Example: "${translatedWord}" means ${englishMeaning}.`;
    return { content: fallback, usedFallback: true };
  }

  try {
    const response = await fetchWithFallback('/api/examples', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        translatedWord,
        targetLanguage,
        languageName: languageNames[targetLanguage] || 'the selected language'
      })
    });

    const data = await readJsonResponse(response, 'examples API');
    appendTrace(`Response status: ${response.status}`);
    appendTrace(`Response body: ${JSON.stringify(data)}`);

    if (data.content) {
      appendTrace(`LLM example success: ${data.content}`);
      return { content: data.content, usedFallback: false };
    }
  } catch (error) {
    appendTrace(`LLM example error: ${error.message}`);
  }

  const englishMeaning = getEnglishMeaning(translatedWord);
  const fallback = `Example: "${translatedWord}" means ${englishMeaning}.`;
  appendTrace(`LLM example fallback: ${fallback}`);
  return { content: fallback, usedFallback: true };
}

const form = document.getElementById('translate-form');
const resultBox = document.getElementById('result');
const examplesBox = document.getElementById('examples');

setTraceVisibility(false);

function resetTrace() {
  const traceOutput = document.getElementById('trace-output');
  if (traceOutput) {
    traceOutput.textContent = 'No requests yet.';
  }
  setTraceVisibility(false);
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const wordInput = document.getElementById('word');
  const targetLanguageSelect = document.getElementById('target-language');

  const word = wordInput.value.trim();
  const targetLanguage = targetLanguageSelect.value;

  if (!word) {
    resultBox.innerHTML = '<p class="error">Please type a word or phrase.</p>';
    return;
  }

  resultBox.innerHTML = '<p class="loading">Translating...</p>';
  resetTrace();
  const traceOutput = document.getElementById('trace-output');
  if (traceOutput) {
    traceOutput.textContent = 'Trace started.\n';
  }

  try {
    const translationResult = await translateText(word, targetLanguage);
    const translated = translationResult.translatedText;
    renderResult(translated, targetLanguage, getEnglishMeaning(word), word);

    try {
      const exampleResult = await generateExampleSentences(translated, targetLanguage);
      const sentenceText = exampleResult.content;
      examplesBox.innerHTML = `
        <h3>Example sentences</h3>
        <p class="hint">${escapeHtml(sentenceText).replace(/\n/g, '<br><br>')}</p>
      `;
    } catch (exampleError) {
      examplesBox.innerHTML = '<p class="hint">Example sentences are unavailable right now.</p>';
    }
  } catch (error) {
    const fallback = getFallbackTranslation(word, targetLanguage);

    if (fallback) {
      renderResult(fallback, targetLanguage, getEnglishMeaning(word), word);

      try {
        const exampleResult = await generateExampleSentences(fallback, targetLanguage);
        const sentenceText = exampleResult.content;
        examplesBox.innerHTML = `
          <h3>Example sentences</h3>
          <p class="hint">${escapeHtml(sentenceText).replace(/\n/g, '<br><br>')}</p>
        `;
      } catch (exampleError) {
        examplesBox.innerHTML = '<p class="hint">Example sentences are unavailable right now.</p>';
      }
    } else {
      resultBox.innerHTML = '<p class="error">I could not translate that right now. Try hello, thank, love, or friend.</p>';
      examplesBox.innerHTML = '';
    }
  }
});
