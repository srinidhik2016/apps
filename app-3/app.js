const nameDisplay = document.getElementById("nameDisplay");
const status = document.getElementById("status");
const count = document.getElementById("count");
const spinButton = document.getElementById("spinButton");

let names = [];
let remainingNames = [];
let spinTimer;

function pickName() {
  return remainingNames[Math.floor(Math.random() * remainingNames.length)];
}

function showError(message) {
  status.textContent = message;
  status.classList.add("is-error");
  nameDisplay.textContent = "No names";
}

async function loadNames() {
  try {
    const response = await fetch("./nemes.txt", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Could not load the names file.");
    }

    const text = await response.text();
    names = text
      .split(/[\n,]+/)
      .map((name) => name.trim())
      .filter(Boolean);
    remainingNames = [...names];

    if (names.length === 0) {
      throw new Error("Add at least one name to nemes.txt.");
    }

    status.textContent = "Ready to choose a name.";
    count.textContent = `${names.length} names loaded`;
    spinButton.disabled = false;
  } catch (error) {
    showError(error.message);
  }
}

function spin() {
  if (spinTimer || names.length === 0) {
    return;
  }

  if (remainingNames.length === 0) {
    remainingNames = [...names];
    status.textContent = "New round started.";
  }

  spinButton.disabled = true;
  nameDisplay.classList.add("is-spinning");
  status.textContent = "Choosing...";

  let steps = 0;
  let selectedName = pickName();
  spinTimer = window.setInterval(() => {
    selectedName = pickName();
    nameDisplay.textContent = selectedName;
    steps += 1;

    if (steps >= 12) {
      window.clearInterval(spinTimer);
      spinTimer = undefined;
      remainingNames = remainingNames.filter((name) => name !== selectedName);
      nameDisplay.classList.remove("is-spinning");
      status.textContent = "Selected!";
      count.textContent = `${remainingNames.length} names remaining in this round`;
      spinButton.disabled = false;
    }
  }, 110);
}

spinButton.addEventListener("click", spin);
loadNames();
