const uiByLang = {
  en: {
    eyebrow: "Kids Tutor",
    title: "Lingua Spark Kids",
    subtitle: "Learn words and phrases with fewer taps.",
    starsLabel: "Stars",
    streakLabel: "Streak",
    nativeLanguageLabel: "My native language",
    learningLanguageLabel: "I want to learn (choose 1 or 2)",
    learningHint: "Pick one or two learning languages.",
    sourceLabel: "Native",
    targetLabel: "Learning",
    cardsHeading: "Flashcards",
    cardsIntro: "Read your language and the learning language side by side.",
    prev: "Previous",
    next: "Next",
    cardCounter: "Card",
    readOut: "Read Out",
    guessHeading: "Guess The Word",
    guessPromptPrefix: "Which word matches this phrase:",
    guessCorrect: "Great guess!",
    guessWrong: "Nice try. Keep going!",
    phraseHeading: "Pick The Phrase",
    phrasePromptPrefix: "Tap the phrase for this word:",
    phraseCorrect: "Awesome!",
    phraseWrong: "Almost. Try another one.",
    speechPlaying: "Listening...",
    speechLoading: "Loading voice...",
    speechUnavailable: "Audio is not available in this browser.",
    speechError: "Could not play this audio right now."
  },
  fr: {
    eyebrow: "Tuteur Enfants",
    title: "Etincelle Lingua Kids",
    subtitle: "Apprends des mots et des phrases avec moins de clics.",
    starsLabel: "Etoiles",
    streakLabel: "Serie",
    nativeLanguageLabel: "Ma langue maternelle",
    learningLanguageLabel: "Je veux apprendre (1 ou 2 langues)",
    learningHint: "Choisis une ou deux langues a apprendre.",
    sourceLabel: "Langue de base",
    targetLabel: "Langue a apprendre",
    cardsHeading: "Cartes Memoire",
    cardsIntro: "Lis les deux langues cote a cote.",
    prev: "Precedent",
    next: "Suivant",
    cardCounter: "Carte",
    readOut: "Lire",
    guessHeading: "Devine Le Mot",
    guessPromptPrefix: "Quel mot correspond a cette phrase :",
    guessCorrect: "Super!",
    guessWrong: "Bien essaye. Continue!",
    phraseHeading: "Choisis La Phrase",
    phrasePromptPrefix: "Tape la phrase pour ce mot :",
    phraseCorrect: "Genial!",
    phraseWrong: "Presque. Reessaie.",
    speechPlaying: "Ecoute...",
    speechLoading: "Chargement de la voix...",
    speechUnavailable: "Audio non disponible dans ce navigateur.",
    speechError: "Impossible de lire cet audio maintenant."
  },
  es: {
    eyebrow: "Tutor Infantil",
    title: "Chispa Lingua Kids",
    subtitle: "Aprende palabras y frases con menos clics.",
    starsLabel: "Estrellas",
    streakLabel: "Racha",
    nativeLanguageLabel: "Mi idioma nativo",
    learningLanguageLabel: "Quiero aprender (elige 1 o 2)",
    learningHint: "Elige uno o dos idiomas para aprender.",
    sourceLabel: "Idioma base",
    targetLabel: "Idioma a aprender",
    cardsHeading: "Tarjetas",
    cardsIntro: "Lee los dos idiomas lado a lado.",
    prev: "Anterior",
    next: "Siguiente",
    cardCounter: "Tarjeta",
    readOut: "Leer",
    guessHeading: "Adivina La Palabra",
    guessPromptPrefix: "Que palabra coincide con esta frase:",
    guessCorrect: "Muy bien!",
    guessWrong: "Buen intento. Sigue!",
    phraseHeading: "Elige La Frase",
    phrasePromptPrefix: "Toca la frase para esta palabra:",
    phraseCorrect: "Perfecto!",
    phraseWrong: "Casi. Intentalo otra vez.",
    speechPlaying: "Escuchando...",
    speechLoading: "Cargando voz...",
    speechUnavailable: "Audio no disponible en este navegador.",
    speechError: "No se pudo reproducir este audio ahora."
  }
};

const languageLabels = {
  en: "English",
  fr: "Francais",
  es: "Espanol"
};

const vocabulary = [
  {
    id: "greet",
    image: "assets/bear-wave.svg",
    imageAlt: "Happy bear waving",
    entries: {
      en: { word: "Hello", phrase: "Hello! How are you?", meaning: "A friendly greeting." },
      fr: { word: "Bonjour", phrase: "Bonjour! Comment ca va?", meaning: "Une salutation amicale." },
      es: { word: "Hola", phrase: "Hola! Como estas?", meaning: "Un saludo amistoso." }
    },
    tip: {
      en: "Use this when you meet someone.",
      fr: "Utilise ce mot quand tu rencontres quelqu'un.",
      es: "Usa esta palabra cuando conoces a alguien."
    }
  },
  {
    id: "thanks",
    image: "assets/star-thanks.svg",
    imageAlt: "Smiling star saying thanks",
    entries: {
      en: { word: "Thank you", phrase: "Thank you for your help.", meaning: "A polite way to show gratitude." },
      fr: { word: "Merci", phrase: "Merci pour ton aide.", meaning: "Une expression de gratitude." },
      es: { word: "Gracias", phrase: "Gracias por tu ayuda.", meaning: "Una expresion de gratitud." }
    },
    tip: {
      en: "Kind words are super important.",
      fr: "Les mots gentils sont tres importants.",
      es: "Las palabras amables son muy importantes."
    }
  },
  {
    id: "name",
    image: "assets/rocket-hello.svg",
    imageAlt: "Rocket with hello sign",
    entries: {
      en: { word: "My name is", phrase: "My name is Alex.", meaning: "A way to introduce yourself." },
      fr: { word: "Je m'appelle", phrase: "Je m'appelle Lina.", meaning: "Une phrase de presentation." },
      es: { word: "Me llamo", phrase: "Me llamo Diego.", meaning: "Una frase de presentacion." }
    },
    tip: {
      en: "Add your own name at the end.",
      fr: "Ajoute ton prenom a la fin.",
      es: "Agrega tu nombre al final."
    }
  },
  {
    id: "please",
    image: "assets/apple-please.svg",
    imageAlt: "Friendly apple with please bubble",
    entries: {
      en: { word: "Please", phrase: "Please can I have water?", meaning: "A polite asking word." },
      fr: { word: "S'il vous plait", phrase: "S'il vous plait, je peux jouer?", meaning: "Un mot poli pour demander." },
      es: { word: "Por favor", phrase: "Por favor, puedo jugar?", meaning: "Una palabra para pedir con respeto." }
    },
    tip: {
      en: "Please is a magic polite word.",
      fr: "S'il vous plait est un mot magique.",
      es: "Por favor es una palabra magica."
    }
  }
];

const speechConfig = {
  en: { lang: "en-US", fallbacks: ["en-us", "en-gb", "en"], keywords: ["english"] },
  fr: { lang: "fr-FR", fallbacks: ["fr-fr", "fr-ca", "fr"], keywords: ["french", "francais"] },
  es: { lang: "es-ES", fallbacks: ["es-es", "es-mx", "es"], keywords: ["spanish", "espanol"] }
};

const state = {
  nativeLang: "en",
  learningLangs: ["fr"],
  cardIndex: 0,
  stars: 0,
  streak: 0,
  guessRound: null,
  phraseRound: null
};

let activeSpeechId = 0;
let activeUtterance = null;

const els = {
  eyebrowText: document.getElementById("eyebrowText"),
  appTitle: document.getElementById("appTitle"),
  appSubtitle: document.getElementById("appSubtitle"),
  starsLabel: document.getElementById("starsLabel"),
  starsCount: document.getElementById("starsCount"),
  streakLabel: document.getElementById("streakLabel"),
  streakCount: document.getElementById("streakCount"),
  nativeLanguageLabel: document.getElementById("nativeLanguageLabel"),
  nativeLanguageSelect: document.getElementById("nativeLanguageSelect"),
  learningLanguageLabel: document.getElementById("learningLanguageLabel"),
  learningHint: document.getElementById("learningHint"),
  learningButtons: document.querySelectorAll(".lang-btn"),

  cardsHeading: document.getElementById("cardsHeading"),
  cardsIntro: document.getElementById("cardsIntro"),
  cardCount: document.getElementById("cardCount"),
  cardImage: document.getElementById("cardImage"),
  sourceLabel: document.getElementById("sourceLabel"),
  sourceWord: document.getElementById("sourceWord"),
  sourcePhrase: document.getElementById("sourcePhrase"),
  targetsContainer: document.getElementById("targetsContainer"),
  cardMeaning: document.getElementById("cardMeaning"),
  cardTip: document.getElementById("cardTip"),
  prevCardBtn: document.getElementById("prevCardBtn"),
  nextCardBtn: document.getElementById("nextCardBtn"),
  speakCardBtn: document.getElementById("speakCardBtn"),
  speakLabel: document.getElementById("speakLabel"),
  speechFeedback: document.getElementById("speechFeedback"),

  guessHeading: document.getElementById("guessHeading"),
  guessPrompt: document.getElementById("guessPrompt"),
  guessOptions: document.getElementById("guessOptions"),
  guessFeedback: document.getElementById("guessFeedback"),

  phraseHeading: document.getElementById("phraseHeading"),
  phrasePrompt: document.getElementById("phrasePrompt"),
  phraseOptions: document.getElementById("phraseOptions"),
  phraseFeedback: document.getElementById("phraseFeedback")
};

function ui() {
  return uiByLang[state.nativeLang];
}

function randomFrom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle(items) {
  const clone = [...items];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

function updateStats() {
  els.starsCount.textContent = String(state.stars);
  els.streakCount.textContent = String(state.streak);
}

function setFeedback(element, message, isGood) {
  element.textContent = message;
  element.classList.remove("ok", "warn");
  element.classList.add(isGood ? "ok" : "warn");
}

function clearFeedback() {
  [els.speechFeedback, els.guessFeedback, els.phraseFeedback].forEach((element) => {
    element.textContent = "";
    element.classList.remove("ok", "warn");
  });
}

function updateScore(isCorrect) {
  if (isCorrect) {
    state.stars += 1;
    state.streak += 1;
  } else {
    state.streak = 0;
  }
  updateStats();
}

function sanitizeLearningChoices() {
  state.learningLangs = state.learningLangs.filter((lang) => lang !== state.nativeLang);
  if (!state.learningLangs.length) {
    const fallback = Object.keys(languageLabels).find((lang) => lang !== state.nativeLang) || "fr";
    state.learningLangs = [fallback];
  }
  if (state.learningLangs.length > 2) {
    state.learningLangs = state.learningLangs.slice(0, 2);
  }
}

function renderLanguageButtons() {
  els.learningButtons.forEach((button) => {
    const lang = button.dataset.lang;
    const isNative = lang === state.nativeLang;
    const isSelected = state.learningLangs.includes(lang);

    button.textContent = languageLabels[lang] || lang;
    button.disabled = isNative;
    button.classList.toggle("is-active", isSelected);
    button.style.opacity = isNative ? "0.45" : "1";
  });
}

function renderCard() {
  const card = vocabulary[state.cardIndex];
  const currentUi = ui();
  const sourceEntry = card.entries[state.nativeLang];

  els.cardCount.textContent = `${currentUi.cardCounter} ${state.cardIndex + 1} / ${vocabulary.length}`;
  els.cardImage.src = card.image;
  els.cardImage.alt = card.imageAlt;
  els.sourceLabel.textContent = `${currentUi.sourceLabel}: ${languageLabels[state.nativeLang]}`;
  els.sourceWord.textContent = sourceEntry.word;
  els.sourcePhrase.textContent = sourceEntry.phrase;
  els.cardMeaning.textContent = sourceEntry.meaning;
  els.cardTip.textContent = card.tip[state.nativeLang];

  els.targetsContainer.innerHTML = "";
  state.learningLangs.forEach((lang) => {
    const entry = card.entries[lang];
    const block = document.createElement("div");
    block.className = "language-card-block target-block";

    const label = document.createElement("p");
    label.className = "card-lang-label";
    label.textContent = `${currentUi.targetLabel}: ${languageLabels[lang]}`;

    const word = document.createElement("p");
    word.className = "card-word";
    word.textContent = entry.word;

    const phrase = document.createElement("p");
    phrase.className = "card-phrase";
    phrase.textContent = entry.phrase;

    block.appendChild(label);
    block.appendChild(word);
    block.appendChild(phrase);
    els.targetsContainer.appendChild(block);
  });
}

function startGuessRound() {
  const currentUi = ui();
  const targetLang = state.learningLangs[0];
  const answerCard = randomFrom(vocabulary);
  const options = shuffle(vocabulary);

  state.guessRound = {
    targetLang,
    answerId: answerCard.id,
    promptPhrase: answerCard.entries[state.nativeLang].phrase,
    options
  };

  els.guessPrompt.textContent = `${currentUi.guessPromptPrefix} \"${state.guessRound.promptPhrase}\"`;
  els.guessOptions.innerHTML = "";

  options.forEach((card) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-image-btn";

    const image = document.createElement("img");
    image.src = card.image;
    image.alt = card.imageAlt;
    image.className = "option-image";

    const label = document.createElement("span");
    label.textContent = card.entries[targetLang].word;

    button.appendChild(image);
    button.appendChild(label);
    button.addEventListener("click", () => handleGuessWord(card.id));
    els.guessOptions.appendChild(button);
  });
}

function handleGuessWord(cardId) {
  const currentUi = ui();
  const isCorrect = cardId === state.guessRound.answerId;
  updateScore(isCorrect);
  setFeedback(els.guessFeedback, isCorrect ? currentUi.guessCorrect : currentUi.guessWrong, isCorrect);
  window.setTimeout(() => {
    els.guessFeedback.textContent = "";
    els.guessFeedback.classList.remove("ok", "warn");
    startGuessRound();
  }, 900);
}

function startPhraseRound() {
  const currentUi = ui();
  const targetLang = state.learningLangs[0];
  const answerCard = randomFrom(vocabulary);
  const options = shuffle(vocabulary);

  state.phraseRound = {
    targetLang,
    answerId: answerCard.id,
    promptWord: answerCard.entries[state.nativeLang].word,
    options
  };

  els.phrasePrompt.textContent = `${currentUi.phrasePromptPrefix} \"${state.phraseRound.promptWord}\"`;
  els.phraseOptions.innerHTML = "";

  options.forEach((card) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-image-btn";

    const image = document.createElement("img");
    image.src = card.image;
    image.alt = card.imageAlt;
    image.className = "option-image";

    const label = document.createElement("span");
    label.textContent = card.entries[targetLang].phrase;

    button.appendChild(image);
    button.appendChild(label);
    button.addEventListener("click", () => handleGuessPhrase(card.id));
    els.phraseOptions.appendChild(button);
  });
}

function handleGuessPhrase(cardId) {
  const currentUi = ui();
  const isCorrect = cardId === state.phraseRound.answerId;
  updateScore(isCorrect);
  setFeedback(els.phraseFeedback, isCorrect ? currentUi.phraseCorrect : currentUi.phraseWrong, isCorrect);
  window.setTimeout(() => {
    els.phraseFeedback.textContent = "";
    els.phraseFeedback.classList.remove("ok", "warn");
    startPhraseRound();
  }, 900);
}

function renderUI() {
  sanitizeLearningChoices();
  const currentUi = ui();

  els.eyebrowText.textContent = currentUi.eyebrow;
  els.appTitle.textContent = currentUi.title;
  els.appSubtitle.textContent = currentUi.subtitle;
  els.starsLabel.textContent = currentUi.starsLabel;
  els.streakLabel.textContent = currentUi.streakLabel;

  els.nativeLanguageLabel.textContent = currentUi.nativeLanguageLabel;
  els.nativeLanguageSelect.value = state.nativeLang;
  els.learningLanguageLabel.textContent = currentUi.learningLanguageLabel;
  els.learningHint.textContent = currentUi.learningHint;

  els.cardsHeading.textContent = currentUi.cardsHeading;
  els.cardsIntro.textContent = currentUi.cardsIntro;
  els.prevCardBtn.textContent = currentUi.prev;
  els.nextCardBtn.textContent = currentUi.next;
  els.speakCardBtn.setAttribute("aria-label", currentUi.readOut);
  els.speakLabel.textContent = currentUi.readOut;

  els.guessHeading.textContent = currentUi.guessHeading;
  els.phraseHeading.textContent = currentUi.phraseHeading;

  renderLanguageButtons();
  renderCard();
  startGuessRound();
  startPhraseRound();
  updateStats();
  clearFeedback();
}

function getSpeechVoice(language) {
  const cfg = speechConfig[language] || speechConfig.en;
  const voices = window.speechSynthesis.getVoices();

  if (!voices.length) {
    return { lang: cfg.lang, voice: null };
  }

  const normalizedVoices = voices.map((voice) => ({
    voice,
    code: (voice.lang || "").toLowerCase().replace("_", "-"),
    name: (voice.name || "").toLowerCase()
  }));

  let match = null;
  cfg.fallbacks.some((fallback) => {
    match = normalizedVoices.find((entry) => entry.code === fallback)?.voice || null;
    if (match) {
      return true;
    }
    match = normalizedVoices.find((entry) => entry.code.startsWith(fallback))?.voice || null;
    return Boolean(match);
  });

  if (!match) {
    cfg.keywords.some((keyword) => {
      match = normalizedVoices.find((entry) => entry.name.includes(keyword))?.voice || null;
      return Boolean(match);
    });
  }

  return { lang: cfg.lang, voice: match };
}

function speakCurrentCard() {
  const currentUi = ui();
  const card = vocabulary[state.cardIndex];
  const speakLang = state.learningLangs[0] || state.nativeLang;
  const target = card.entries[speakLang];

  if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
    setFeedback(els.speechFeedback, currentUi.speechUnavailable, false);
    return;
  }

  // Speak only the learning language to avoid mixed-language output.
  const utterance = new SpeechSynthesisUtterance(`${target.word}. ${target.phrase}`);
  const voiceChoice = getSpeechVoice(speakLang);
  const speechId = activeSpeechId + 1;
  activeSpeechId = speechId;
  activeUtterance = utterance;

  utterance.lang = voiceChoice.lang;
  if (voiceChoice.voice) {
    utterance.voice = voiceChoice.voice;
  }

  utterance.rate = 0.9;
  utterance.pitch = 1.02;
  utterance.volume = 1;
  utterance.onstart = () => {
    if (speechId !== activeSpeechId) {
      return;
    }
    setFeedback(els.speechFeedback, currentUi.speechPlaying, true);
  };
  utterance.onend = () => {
    if (speechId !== activeSpeechId) {
      return;
    }
    activeUtterance = null;
    els.speechFeedback.textContent = "";
    els.speechFeedback.classList.remove("ok", "warn");
  };
  utterance.onerror = (event) => {
    if (speechId !== activeSpeechId || event.error === "canceled" || event.error === "interrupted") {
      return;
    }
    activeUtterance = null;
    setFeedback(els.speechFeedback, currentUi.speechError, false);
  };

  if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
    window.speechSynthesis.cancel();
  }

  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }

  // Keep a strong reference for browsers that discard utterances too early.
  window.setTimeout(() => {
    if (speechId === activeSpeechId && activeUtterance === utterance && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  }, 250);

  window.speechSynthesis.speak(utterance);
}

els.nativeLanguageSelect.addEventListener("change", (event) => {
  state.nativeLang = event.target.value;
  state.cardIndex = 0;
  state.streak = 0;
  sanitizeLearningChoices();
  renderUI();
});

els.learningButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const lang = button.dataset.lang;
    if (!lang || lang === state.nativeLang) {
      return;
    }

    if (state.learningLangs.includes(lang)) {
      if (state.learningLangs.length === 1) {
        return;
      }
      state.learningLangs = state.learningLangs.filter((item) => item !== lang);
    } else {
      if (state.learningLangs.length >= 2) {
        state.learningLangs.shift();
      }
      state.learningLangs.push(lang);
    }

    renderUI();
  });
});

els.prevCardBtn.addEventListener("click", () => {
  state.cardIndex = (state.cardIndex - 1 + vocabulary.length) % vocabulary.length;
  renderCard();
});

els.nextCardBtn.addEventListener("click", () => {
  state.cardIndex = (state.cardIndex + 1) % vocabulary.length;
  renderCard();
});

els.speakCardBtn.addEventListener("click", () => {
  speakCurrentCard();
});

if ("speechSynthesis" in window) {
  window.speechSynthesis.getVoices();
}

renderUI();
