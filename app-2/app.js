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
  }
};

const pronunciationGuide = {
  ta: {
    hello: 'vanakkam',
    thank: 'nandri',
    love: 'anbu',
    friend: 'nanban'
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
    சோதனை: 'sodhanai'
  },
  hi: {
    नमस्ते: 'namaste',
    धन्यवाद: 'dhanyavaad',
    प्यार: 'pyaar',
    दोस्त: 'dost',
    परीक्षा: 'pariksha'
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

const traceToggleButton = document.getElementById('trace-toggle');
if (traceToggleButton) {
  traceToggleButton.addEventListener('click', (event) => {
    event.preventDefault();
    toggleTrace();
  });
}

function getEnglishMeaning(word) {
  const key = normalizeWord(word);
  const meanings = {
    hello: 'hello',
    thank: 'thank you',
    love: 'love',
    friend: 'friend'
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

function getTransliteration(word, targetLanguage) {
  const trimmed = word.trim();
  return transliterationGuide[targetLanguage]?.[trimmed] || transliterationGuide[targetLanguage]?.[normalizeWord(trimmed)] || null;
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

async function translateText(word, targetLanguage) {
  appendTrace(`Request: translate "${word}" -> ${targetLanguage}`);

  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        word,
        targetLanguage
      })
    });

    const data = await response.json();
    appendTrace(`Response status: ${response.status}`);
    appendTrace(`Response body: ${JSON.stringify(data)}`);

    if (!response.ok) {
      throw new Error('Translation service failed');
    }

    if (data.translatedText) {
      appendTrace(`Using translated text: ${data.translatedText}`);
      return data.translatedText;
    }
  } catch (error) {
    appendTrace(`Error: ${error.message}`);
  }

  const fallback = getFallbackTranslation(word, targetLanguage) || word;
  appendTrace(`Falling back to local translation: ${fallback}`);
  return fallback;
}

async function generateExampleSentences(translatedWord, targetLanguage) {
  appendTrace(`Request: examples for "${translatedWord}" in ${targetLanguage}`);

  try {
    const response = await fetch('/api/examples', {
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

    const data = await response.json();
    appendTrace(`Response status: ${response.status}`);
    appendTrace(`Response body: ${JSON.stringify(data)}`);

    if (!response.ok) {
      throw new Error('Example sentence generation failed');
    }

    if (data.content) {
      appendTrace(`Using example content: ${data.content}`);
      return data.content;
    }
  } catch (error) {
    appendTrace(`Error: ${error.message}`);
  }

  const englishMeaning = getEnglishMeaning(translatedWord);
  const fallback = `Example: "${translatedWord}" means ${englishMeaning}.`;
  appendTrace(`Falling back to local example text: ${fallback}`);
  return fallback;
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
    const translated = await translateText(word, targetLanguage);
    renderResult(translated, targetLanguage, getEnglishMeaning(word), word);

    try {
      const sentenceText = await generateExampleSentences(translated, targetLanguage);
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
        const sentenceText = await generateExampleSentences(fallback, targetLanguage);
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
