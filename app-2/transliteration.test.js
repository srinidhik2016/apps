const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const appCode = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');

function createDocumentStub() {
  const elements = new Map();

  return {
    getElementById(id) {
      if (!elements.has(id)) {
        const element = {
          id,
          hidden: false,
          style: {},
          textContent: '',
          innerHTML: '',
          setAttribute() {},
          getAttribute() { return 'false'; },
          addEventListener() {},
          appendChild() {},
          removeChild() {},
          value: ''
        };
        elements.set(id, element);
      }
      return elements.get(id);
    },
    createElement() {
      return {
        style: {},
        textContent: '',
        innerHTML: '',
        appendChild() {},
        removeChild() {},
        setAttribute() {},
        getAttribute() { return 'false'; }
      };
    }
  };
}

const context = {
  document: createDocumentStub(),
  window: {},
  console,
  fetch: async () => ({ ok: true, json: async () => ({}) }),
  setTimeout,
  clearTimeout
};
context.window = context;

vm.createContext(context);
vm.runInContext(appCode, context);

assert.strictEqual(context.getTransliteration('சோதனை', 'ta'), 'sodhanai');
assert.strictEqual(context.getTransliteration('கல்வி', 'ta'), 'kalvi');
assert.match(context.getTransliteration('வணக்கம்', 'ta'), /va|van/i);
assert.match(context.getTransliteration('नमस्ते', 'hi'), /namaste|na/i);

console.log('Transliteration tests passed');
