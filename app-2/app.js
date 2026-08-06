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

function renderResult(translation, targetLanguage, englishMeaning, originalWord) {
  const languageLabel = languageNames[targetLanguage] || 'Selected language';
  const pronunciation = getPronunciation(originalWord, targetLanguage);

  resultBox.innerHTML = `
    <p class="translation"><strong>${escapeHtml(translation)}</strong></p>
    <p class="hint">${escapeHtml(languageLabel)} translation</p>
    <p class="hint">English: ${escapeHtml(originalWord)}</p>
    ${pronunciation ? `<p class="hint">How to say it: ${escapeHtml(pronunciation)}</p>` : ''}
  `;
}

async function translateText(word, targetLanguage) {
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

  if (!response.ok) {
    throw new Error('Translation service failed');
  }

  const data = await response.json();
  return data.translatedText;
}

async function generateExampleSentences(translatedWord, targetLanguage) {
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

  if (!response.ok) {
    throw new Error('Example sentence generation failed');
  }

  const data = await response.json();
  return data.content || 'No examples available.';
}

const form = document.getElementById('translate-form');
const resultBox = document.getElementById('result');
const examplesBox = document.getElementById('examples');

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
