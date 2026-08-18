const chatWall = document.querySelector('#chat-wall');
const form = document.querySelector('#chat-form');
const input = document.querySelector('#message-input');
const modeButton = document.querySelector('#mode-button');
let currentMode = 'math';
let spellingChallengeLength = null;
let spellingChallengeWord = null;
let spellingNeedsAge = false;
let spellingHasNextChallenge = false;
let learnerAge = null;
let writingTask = null;
let historyTopic = null;
let userProfile = { name: 'You', avatar: '🐰' };
try {
  const savedProfile = JSON.parse(localStorage.getItem('mathly-profile') || 'null');
  if (savedProfile?.name && savedProfile?.avatar) userProfile = savedProfile;
} catch (error) {
  localStorage.removeItem('mathly-profile');
}
const chatHistories = { math: chatWall.innerHTML, spelling: null, history: null };

const spellingAnswers = {
  necessary: ['necessary', 'Remember: one collar and two socks: one c, two s.'],
  definitely: ['definitely', 'Think of definite with -ly at the end. There is no a.'],
  separate: ['separate', 'There is a rat in separate: sep-a-rat-e.'],
  beautiful: ['beautiful', 'Remember the order: beau-ti-ful.'],
  receive: ['receive', 'Use i before e except after c: receive.'],
  tomorrow: ['tomorrow', 'Tomorrow has one m and two r’s.'],
  because: ['because', 'A quick memory clue: Big Elephants Can Always Understand Small Elephants.']
};

function now() {
  return new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date());
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function applyUserProfile() {
  const profileButton = document.querySelector('#user-profile-button');
  profileButton.textContent = userProfile.avatar;
  profileButton.setAttribute('aria-label', `Profile: ${userProfile.name}`);
  document.querySelectorAll('.rabbit-avatar').forEach((profileAvatar) => {
    profileAvatar.textContent = userProfile.avatar;
    profileAvatar.setAttribute('aria-label', userProfile.name);
  });
}

function tutorAnswer(problem) {
  const text = problem.toLowerCase().replace(/,/g, '').trim();
  let match = text.match(/(?:what is |calculate )?(\d+(?:\.\d+)?)\s*%\s*of\s*(\d+(?:\.\d+)?)/);
  if (match) {
    const percent = Number(match[1]);
    const amount = Number(match[2]);
    const answer = (percent / 100) * amount;
    return `<span class="answer-title">The answer is ${answer}.</span><ol class="steps"><li>Turn ${percent}% into a decimal: ${percent} / 100 = ${percent / 100}.</li><li>Multiply: ${percent / 100} × ${amount} = <strong>${answer}</strong>.</li></ol>`;
  }

  match = text.match(/(?:solve\s*)?(-?\d+(?:\.\d+)?)\s*x\s*([+-])\s*(\d+(?:\.\d+)?)\s*=\s*(-?\d+(?:\.\d+)?)/);
  if (match) {
    const coefficient = Number(match[1]);
    const constant = Number(match[3]) * (match[2] === '-' ? -1 : 1);
    const result = Number(match[4]);
    const x = (result - constant) / coefficient;
    return `<span class="answer-title">x = ${x}</span><ol class="steps"><li>Move ${constant >= 0 ? constant : Math.abs(constant)} to the other side: ${result} ${constant >= 0 ? '-' : '+'} ${Math.abs(constant)} = ${result - constant}.</li><li>Divide by ${coefficient}: ${result - constant} / ${coefficient} = <strong>${x}</strong>.</li></ol>`;
  }

  match = text.match(/(\d+)\s*\/\s*(\d+)\s*([+-])\s*(\d+)\s*\/\s*(\d+)/);
  if (match) {
    const firstTop = Number(match[1]);
    const firstBottom = Number(match[2]);
    const secondTop = Number(match[4]);
    const secondBottom = Number(match[5]);
    const sign = match[3] === '-' ? -1 : 1;
    const numerator = firstTop * secondBottom + sign * secondTop * firstBottom;
    const denominator = firstBottom * secondBottom;
    return `<span class="answer-title">${numerator}/${denominator}</span><ol class="steps"><li>Use a common denominator: ${firstTop}/${firstBottom} = ${firstTop * secondBottom}/${denominator}.</li><li>Combine the numerators: ${firstTop * secondBottom} ${sign === 1 ? '+' : '-'} ${secondTop * firstBottom} = <strong>${numerator}/${denominator}</strong>.</li></ol>`;
  }

  match = text.match(/(-?\d+(?:\.\d+)?)\s*([+\-*\/])\s*(-?\d+(?:\.\d+)?)/);
  if (match) {
    const left = Number(match[1]);
    const right = Number(match[3]);
    const operator = match[2];
    const answer = operator === '+' ? left + right : operator === '-' ? left - right : operator === '*' ? left * right : left / right;
    return `<span class="answer-title">The answer is ${answer}.</span><ol class="steps"><li>Start with ${left}.</li><li>${operator === '/' ? 'Divide' : operator === '*' ? 'Multiply' : operator === '+' ? 'Add' : 'Subtract'} by ${right}: ${left} ${operator} ${right} = <strong>${answer}</strong>.</li></ol>`;
  }

  return `<span class="answer-title">Let’s solve it together.</span><p>Could you write the problem with numbers and symbols? For example: <strong>2x + 4 = 12</strong> or <strong>18 ÷ 3</strong>.</p>`;
}

function historyAnswer(problem) {
  const text = problem.toLowerCase();
  if (/titanic|tietanec|tietanic|titanec|titanik/.test(text)) {
    historyTopic = 'titanic';
    return '<span class="answer-title">The Titanic sank on April 15, 1912. 🚢</span><p>The RMS Titanic hit an iceberg during its first voyage across the North Atlantic and sank in the early morning. It was traveling from Southampton to New York.</p>';
  }
  if (/egypt|pyramid|pharaoh/.test(text)) {
    historyTopic = 'egypt';
    return '<span class="answer-title">Ancient Egypt 📜</span><p>Ancient Egyptians built pyramids as tombs for pharaohs. They developed writing called hieroglyphics and used the Nile River for farming, travel, and water.</p>';
  }
  if (/rome|roman|caesar/.test(text)) {
    historyTopic = 'rome';
    return '<span class="answer-title">Ancient Rome 🏛️</span><p>Rome grew from a city into a huge empire. Julius Caesar was a famous Roman leader, and Roman roads, laws, buildings, and language influenced many places.</p>';
  }
  if (/dinosaur|prehistoric/.test(text)) {
    historyTopic = 'dinosaurs';
    return '<span class="answer-title">Dinosaurs 🦖</span><p>Dinosaurs lived millions of years ago. Some ate plants, some ate meat, and birds are their living relatives. Scientists learn about them from fossils.</p>';
  }
  if (/world war\s*(?:1|one).*world war\s*(?:2|two)|world war\s*(?:1|one).*2|wwi.*wwii|ww1.*ww2/.test(text)) {
    historyTopic = 'world-wars';
    return '<span class="answer-title">World War I and World War II 🌍</span><p><strong>World War I</strong> lasted from 1914 to 1918. <strong>World War II</strong> lasted from 1939 to 1945. They were separate global wars involving many countries, and both changed borders, governments, and daily life around the world.</p><p>World War II happened about 21 years after World War I ended.</p>';
  }
  if (/world war|wwii|ww2/.test(text)) {
    historyTopic = 'world-war-2';
    return '<span class="answer-title">World War II 🌍</span><p>World War II lasted from 1939 to 1945. Many countries took part, and the war changed borders, governments, and daily life around the world.</p>';
  }
  return '<span class="answer-title">Let’s explore history! 📚</span><p>Ask me about Ancient Egypt, Rome, dinosaurs, World War II, famous people, inventions, or another time in history.</p>';
}

function historyFollowUp() {
  const followUps = {
    titanic: '<span class="answer-title">More about the Titanic 🚢</span><p>The ship struck the iceberg late on April 14, 1912. It sank a few hours later, in the early morning of April 15. More than 1,500 people died, and the disaster led to stronger international safety rules for ships.</p>',
    egypt: '<span class="answer-title">More about Ancient Egypt 📜</span><p>Ancient Egyptian society included farmers, craftspeople, scribes, soldiers, and rulers. The Nile’s yearly floods helped farmers grow food, while scribes recorded laws, stories, and trade.</p>',
    rome: '<span class="answer-title">More about Ancient Rome 🏛️</span><p>Roman power spread around the Mediterranean through armies, roads, trade, and government. Latin, Roman law, and engineering influenced many later societies.</p>',
    dinosaurs: '<span class="answer-title">More about dinosaurs 🦖</span><p>Fossils show that dinosaurs lived on every continent. Some dinosaurs had feathers, and a major extinction event about 66 million years ago ended the age of non-bird dinosaurs.</p>',
    'world-war-2': '<span class="answer-title">More about World War II 🌍</span><p>The war included the Holocaust, the attack on Pearl Harbor, major battles in Europe and the Pacific, and the D-Day invasion. It ended in 1945 after Germany and Japan surrendered.</p>',
    'world-wars': '<span class="answer-title">More about both world wars 🌍</span><p>World War I was strongly connected to rival alliances and competition between empires. World War II grew from unresolved tensions after World War I, aggressive expansion, and the rise of Nazi Germany.</p>'
  };
  return followUps[historyTopic] || '<span class="answer-title">Tell me which history topic you want to explore.</span><p>You can ask about the Titanic, World War II, Ancient Egypt, Rome, or dinosaurs.</p>';
}

function spellingAnswer(problem) {
  const cleaned = problem.toLowerCase().replace(/[?!.,]/g, ' ').trim();
  const word = cleaned.replace(/^(how do you spell|spell|how to spell)\s+/, '').trim().split(/\s+/)[0];
  const known = spellingAnswers[word];
  if (known) {
    return `<span class="answer-title">${known[0]}</span><p>${known[1]}</p>`;
  }
  if (/^[a-z]+$/.test(word)) {
    return `<span class="answer-title">Good work! Wonderful! Yaaaaaay! 🎉</span><p><strong>${word}</strong> is spelled correctly.</p>`;
  }
  return '<span class="answer-title">I can help with that.</span><p>Ask me like this: <strong>How do you spell beautiful?</strong></p>';
}

function looksLikeWord(word) {
  if (word.length === 1) return /^[aeiou]$/i.test(word);
  if (!/^[a-z]+$/i.test(word)) return false;
  if (!/[aeiouy]/i.test(word)) return false;
  return !/[bcdfghjklmnpqrstvwxz]{5,}/i.test(word);
}

function wordLengthAnswer(word) {
  const cleanWord = word.trim().toLowerCase().replace(/\s+/g, '');
  const expectedLength = spellingChallengeLength;
  const expectedWord = spellingChallengeWord;
  spellingHasNextChallenge = false;
  if (expectedWord) {
    if (cleanWord === expectedWord) {
      spellingChallengeLength = null;
      spellingChallengeWord = null;
      return `<span class="answer-title">Wonderful! 🎉</span><p>You spelled <strong>${expectedWord}</strong> correctly.</p><p>What would you like to write using <strong>${expectedWord}</strong>?</p><div class="suggestions"><button type="button" data-writing="sentence" data-word="${expectedWord}">A sentence</button><button type="button" data-writing="paragraph" data-word="${expectedWord}">A paragraph</button><button type="button" data-writing="story" data-word="${expectedWord}">A story</button></div>`;
    }
    return `<span class="answer-title">Not quite.</span><p>Try again. The word I gave you has ${expectedWord.length} letters.</p>`;
  }
  if (looksLikeWord(cleanWord) && cleanWord.length === expectedLength) {
    spellingChallengeLength = null;
    const letterLabel = expectedLength === 1 ? 'letter' : 'letters';
    return `<span class="answer-title">Wonderful! 🎉</span><p><strong>${cleanWord}</strong> has exactly ${expectedLength} ${letterLabel}.</p><p>What would you like to write using <strong>${cleanWord}</strong>?</p><div class="suggestions"><button type="button" data-writing="sentence" data-word="${cleanWord}">A sentence</button><button type="button" data-writing="paragraph" data-word="${cleanWord}">A paragraph</button><button type="button" data-writing="story" data-word="${cleanWord}">A story</button></div>`;
  }
  if (!looksLikeWord(cleanWord)) {
    return `<span class="answer-title">Not quite yet.</span><p><strong>${cleanWord}</strong> does not look like a word. Try a real word with exactly ${expectedLength} letters.</p>`;
  }
  if (cleanWord.length > expectedLength) {
    spellingChallengeLength = cleanWord.length + 1;
    spellingHasNextChallenge = true;
    return `<span class="answer-title">Even better! 🌟</span><p><strong>${cleanWord}</strong> has ${cleanWord.length} letters, which is longer than the ${expectedLength}-letter challenge.</p><p>That shows you are ready for a bigger spelling challenge!</p>`;
  }
  return `<span class="answer-title">Not quite.</span><p><strong>${cleanWord}</strong> has ${cleanWord.length} letters. I asked for a word with exactly ${expectedLength} letters.</p>`;
}

function nextChallengeAnswer() {
  spellingHasNextChallenge = false;
  return `<span class="answer-title">Your next challenge! 🚀</span><p>Write a word with exactly <strong>${spellingChallengeLength} letters</strong>. Type it below when you are ready.</p>`;
}

function spellingAgeAnswer(ageText) {
  const ageMatch = ageText.match(/\b\d+\b/);
  if (!ageMatch) {
    return '<span class="answer-title">Sure! 😊</span><p>How many years old are you? Tell me your age as a number, like <strong>9</strong>.</p>';
  }
  const age = ageMatch ? Number(ageMatch[0]) : NaN;
  if (!Number.isInteger(age) || age < 1 || age > 120) {
    return '<span class="answer-title">That is a very big number!</span><p>Please enter your age as a whole number from <strong>1 to 120</strong>, like <strong>8</strong>, so I can choose the right challenge.</p>';
  }
  const length = age;
  learnerAge = age;
  spellingNeedsAge = false;
  spellingChallengeLength = length;
  spellingChallengeWord = null;
  return `<span class="answer-title">Thanks! You are ${age}.</span><p>Write a word with exactly <strong>${length} letter${length === 1 ? '' : 's'}</strong>.</p><p>Type it below and I’ll check it.</p>`;
}

function grammarAnswer(text) {
  const cleanText = text.trim();
  const task = writingTask;
  writingTask = null;
  const age = learnerAge || 10;
  const startsWithCapital = /^[A-Z]/.test(cleanText);
  const endsWithPunctuation = /[.!?]$/.test(cleanText);
  const hasMultipleSentences = (cleanText.match(/[.!?](?:\s|$)/g) || []).length >= 2;
  const encouragement = age <= 7
    ? 'Start with a capital letter and finish with a full stop.'
    : age <= 12
      ? 'Check your capital letters, punctuation, and complete sentences.'
      : 'Check your sentence structure, punctuation, and clear details.';

  if (task === 'sentence') {
    const checks = [];
    if (!startsWithCapital) checks.push('start with a capital letter');
    if (!endsWithPunctuation) checks.push('end with a full stop, question mark, or exclamation mark');
    return checks.length
      ? `<span class="answer-title">Good try!</span><p>For a sentence, ${checks.join(' and ')}.</p><p>${encouragement}</p>`
      : `<span class="answer-title">Wonderful sentence! 🎉</span><p>It starts and ends correctly. You can add more detail if you like.</p>`;
  }

  if (task === 'paragraph') {
    const target = age <= 7 ? 'two sentences' : age <= 12 ? 'three sentences' : 'four or more sentences';
    return hasMultipleSentences
      ? `<span class="answer-title">Great paragraph start! 🎉</span><p>Your ideas are beginning to form a paragraph. For your age, try writing ${target} about the same topic.</p>`
      : `<span class="answer-title">Good start!</span><p>For a paragraph, add ${target} about the same topic. ${encouragement}</p>`;
  }

  if (cleanText.split(/\s+/).length < 5) {
    return `<span class="answer-title">Good start! 📖</span><p>A story needs more details. Add who the story is about, where it happens, and what happens next.</p><p>${encouragement}</p>`;
  }
  return `<span class="answer-title">Great story! 📖</span><p>You have started your story. Check that it has a beginning, a middle, and an ending, with details about who, where, and what happens.</p>`;
}

function addMessage(text, type, isHtml = false) {
  const row = document.createElement('div');
  row.className = `message-row ${type}-row`;
  const avatar = type === 'tutor' ? `<div class="avatar small-avatar bot-avatar" aria-hidden="true">${currentMode === 'math' ? '🧮' : currentMode === 'spelling' ? '🔤' : '📚'}</div>` : `<div class="avatar small-avatar rabbit-avatar" aria-label="${escapeHtml(userProfile.name)}">${escapeHtml(userProfile.avatar)}</div>`;
  const body = isHtml ? text : escapeHtml(text);
  row.innerHTML = type === 'tutor'
    ? `${avatar}<div class="bubble ${type}-bubble"><div>${body}</div><time>${now()}</time></div>`
    : `<div class="bubble ${type}-bubble"><div>${body}</div><time>${now()}</time></div>${avatar}`;
  chatWall.appendChild(row);
  chatWall.scrollTop = chatWall.scrollHeight;
}

function sendProblem(problem) {
  addMessage(problem, 'user');
  if (currentMode === 'math' && /^(spell|spelling)$/i.test(problem.trim())) {
    modeButton.click();
    return;
  }
  const typing = document.createElement('div');
  typing.className = 'message-row tutor-row';
  const tutorName = currentMode === 'math' ? 'Mathly' : currentMode === 'spelling' ? 'Spellly' : 'Historyly';
  typing.innerHTML = `<div class="avatar small-avatar bot-avatar" aria-hidden="true">${currentMode === 'math' ? '🧮' : currentMode === 'spelling' ? '🔤' : '📚'}</div><div class="bubble tutor-bubble typing">${tutorName} is working it out...</div>`;
  chatWall.appendChild(typing);
  chatWall.scrollTop = chatWall.scrollHeight;
  window.setTimeout(() => {
    typing.remove();
    const answer = currentMode === 'math'
      ? /^(?:hi|hello)\b/i.test(problem.trim())
        ? '<span class="answer-title">Hello! 👋</span><p>What would you like to learn today?</p>'
        : tutorAnswer(problem)
      : currentMode === 'history'
        ? /^(?:hi|hello)\b/i.test(problem.trim())
          ? '<span class="answer-title">Hello! 👋</span><p>Ready to explore history?</p>'
          : historyTopic && /tell me more|more about|explain more|what else/i.test(problem)
            ? historyFollowUp()
          : historyAnswer(problem)
      : /^(?:hi|hello)\b/i.test(problem.trim())
        ? '<span class="answer-title">Hello! 👋</span><p>Ready for a spelling challenge?</p>'
      : spellingNeedsAge || (!learnerAge && /^\d+$/.test(problem.trim()))
        ? spellingAgeAnswer(problem)
        : spellingHasNextChallenge && /(?:what\s+.*chall|next\s+chall)/i.test(problem)
          ? nextChallengeAnswer()
        : writingTask
          ? grammarAnswer(problem)
        : spellingChallengeLength
          ? wordLengthAnswer(problem)
          : spellingAnswer(problem);
    addMessage(answer, 'tutor', true);
  }, 650);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const problem = input.value.trim();
  if (!problem) return;
  input.value = '';
  sendProblem(problem);
});

chatWall.addEventListener('click', (event) => {
  const prompt = event.target.closest('[data-prompt]')?.dataset.prompt;
  if (prompt) sendProblem(prompt);
  const length = event.target.closest('[data-length]')?.dataset.length;
  if (length) {
    spellingChallengeLength = Number(length);
    addMessage(`Write a word with exactly ${length} letters.`, 'tutor');
  }
  const writingType = event.target.closest('[data-writing]')?.dataset.writing;
  const writingWord = event.target.closest('[data-writing]')?.dataset.word;
  if (writingType && writingWord) {
    writingTask = writingType;
    addMessage(`Let’s write a ${writingType} using “${writingWord}”. Start typing when you’re ready!`, 'tutor');
    input.focus();
  }
});

document.querySelector('#clear-chat').addEventListener('click', () => {
  chatWall.innerHTML = '<div class="date-chip">NEW CHAT</div>';
  learnerAge = null;
  spellingChallengeLength = null;
  spellingChallengeWord = null;
  spellingHasNextChallenge = false;
  writingTask = null;
  historyTopic = null;
  spellingNeedsAge = currentMode === 'spelling';
  addMessage(currentMode === 'math' ? 'Fresh page, fresh problem. What are we working on?' : currentMode === 'spelling' ? 'Fresh chat! How many years old are you?' : 'Fresh history chat! What time or event would you like to explore?', 'tutor');
});

document.querySelector('#attach-button').addEventListener('click', () => input.focus());
const chatMenu = document.querySelector('#chat-menu');
const chatMenuPanel = document.querySelector('#chat-menu-panel');
chatMenu.addEventListener('click', () => {
  chatMenuPanel.hidden = !chatMenuPanel.hidden;
});
chatMenuPanel.addEventListener('click', (event) => {
  const action = event.target.closest('[data-menu-action]')?.dataset.menuAction;
  chatMenuPanel.hidden = true;
  if (action === 'profile') document.querySelector('#user-profile-button').click();
  if (action === 'tutor') modeButton.click();
  if (action === 'clear') document.querySelector('#clear-chat').click();
});

document.querySelector('#user-profile-button').addEventListener('click', () => {
  const name = window.prompt('What should your profile name be?', userProfile.name);
  if (name === null) return;
  const avatar = window.prompt('Choose any emoji or symbol for your profile:', userProfile.avatar);
  userProfile.name = name.trim() || 'You';
  userProfile.avatar = avatar?.trim() || '🐰';
  localStorage.setItem('mathly-profile', JSON.stringify(userProfile));
  applyUserProfile();
});

applyUserProfile();

modeButton.addEventListener('click', () => {
  chatHistories[currentMode] = chatWall.innerHTML;
  currentMode = currentMode === 'math' ? 'spelling' : currentMode === 'spelling' ? 'history' : 'math';
  spellingChallengeLength = null;
  spellingChallengeWord = null;
  spellingHasNextChallenge = false;
  writingTask = null;
  spellingNeedsAge = currentMode === 'spelling' && !chatHistories.spelling;
  chatWall.innerHTML = chatHistories[currentMode] || '<div class="date-chip">TODAY</div>';
  const isMath = currentMode === 'math';
  const isSpelling = currentMode === 'spelling';
  document.querySelector('#mode-name').textContent = isMath ? 'Mathly' : isSpelling ? 'Spellly' : 'Historyly';
  document.querySelector('.brand-mark').textContent = isMath ? '🧮' : isSpelling ? '🔤' : '📚';
  const welcomeMessage = document.querySelector('#welcome-message');
  const suggestions = document.querySelector('.welcome-bubble .suggestions');
  if (welcomeMessage) {
    welcomeMessage.textContent = isMath
      ? 'Hey! I’m Mathly. Send me any math problem and I’ll walk through it with you, step by step.'
      : isSpelling
        ? 'Hi! I’m Spellly. Choose a challenge, write your word, and I’ll check it for you.'
        : 'Hi! I’m Historyly. Ask me about a time, place, person, or event in history.';
  }
  if (suggestions) {
    suggestions.innerHTML = isMath
      ? '<button type="button" data-prompt="What is 15% of 80?">15% of 80</button><button type="button" data-prompt="Solve 3x + 5 = 20">Solve 3x + 5 = 20</button><button type="button" data-prompt="What is 3/4 + 1/8?">3/4 + 1/8</button>'
      : isSpelling
        ? '<button type="button" data-length="5">5 letters</button><button type="button" data-length="6">6 letters</button><button type="button" data-length="7">7 letters</button><button type="button" data-length="9">9 letters</button>'
        : '<button type="button" data-prompt="Tell me about Ancient Egypt">Ancient Egypt</button><button type="button" data-prompt="Tell me about Ancient Rome">Ancient Rome</button><button type="button" data-prompt="Why are dinosaurs important?">Dinosaurs</button>';
  }
  document.querySelectorAll('.bot-avatar').forEach((avatar) => { avatar.textContent = isMath ? '🧮' : isSpelling ? '🔤' : '🎨'; });
  input.placeholder = isMath ? 'Type a math problem...' : isSpelling ? 'Type a word to spell...' : 'Ask about history...';
  modeButton.textContent = isMath ? 'Spell' : isSpelling ? 'History' : 'Math';
  modeButton.setAttribute('aria-label', isMath ? 'Switch to spelling tutor' : isSpelling ? 'Switch to history tutor' : 'Switch to math tutor');
  if (isSpelling && !chatHistories.spelling) {
    addMessage('Hi! I’m Spellly. How many years old are you?', 'tutor');
    chatHistories.spelling = chatWall.innerHTML;
  }
  if (!isMath && !isSpelling && !chatHistories.history) {
    addMessage('Hi! I’m Historyly. What would you like to learn about history?', 'tutor');
    chatHistories.history = chatWall.innerHTML;
  }
});