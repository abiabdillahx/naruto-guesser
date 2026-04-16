const API_BASE = "https://dattebayo-api.onrender.com";
const PAGES_TO_FETCH = [1, 2, 3, 4];
const BLOCKED_IMAGE_URLS = new Set([
  "https://static.wikia.nocookie.net/naruto/images/2/21/Profile_Jiraiya.png",
  "https://static.wikia.nocookie.net/naruto/images/4/45/Fud%C5%8D.png",
  "https://static.wikia.nocookie.net/naruto/images/7/7d/Crimson_Fist.png",
  "https://static.wikia.nocookie.net/naruto/images/c/cf/Nango.png",
  "https://static.wikia.nocookie.net/naruto/images/1/19/Akaboshi.png",
  "https://static.wikia.nocookie.net/naruto/images/9/95/Benten.png",
  "https://static.wikia.nocookie.net/naruto/images/0/09/Chushin.png",
]);

/* ── State ─────────────────────────────────────────────────── */
let allCharacters = [];
let currentChar = null;
let score = 0;
let streak = 0;
let roundNum = 1;
let attempts = 5;

let roundOver = false;
let isSubmitting = false;
let usedChars = new Set();

/* ── DOM ───────────────────────────────────────────────────── */
const $loading = document.getElementById("loading-screen");
const $error = document.getElementById("error-screen");
const $gameArea = document.getElementById("game-area");
const $gameOver = document.getElementById("gameover-screen");

const $scoreEl = document.getElementById("score");
const $streakEl = document.getElementById("streak");
const $roundEl = document.getElementById("round");
const $attemptsEl = document.getElementById("attempts-left");

const $charImg = document.getElementById("char-img");
const $imageWrap = document.getElementById("image-wrap");

const $guessSection = document.getElementById("guess-section");
const $guessInput = document.getElementById("guess-input");
const $suggestions = document.getElementById("suggestions");
const $submitBtn = document.getElementById("submit-btn");

const $feedbackCard = document.getElementById("feedback-card");
const $feedbackMsg = document.getElementById("feedback-msg");
const $nextBtn = document.getElementById("next-btn");

const $finalScoreEl = document.getElementById("final-score");
const $gameoverMsg = document.getElementById("gameover-msg");
const $restartBtn = document.getElementById("restart-btn");

/* ── Helpers ───────────────────────────────────────────────── */
function show(el) {
  el.style.display = "block";
}
function hide(el) {
  el.style.display = "none";
}
function normalize(s) {
  return s.trim().toLowerCase();
}
function pickRandom(a) {
  return a[Math.floor(Math.random() * a.length)];
}

function updateScoreboard() {
  $scoreEl.textContent = score;
  $streakEl.textContent = streak;
  $roundEl.textContent = roundNum;
  $attemptsEl.textContent = attempts;
}

function flashImage(type) {
  $imageWrap.classList.remove("flash-correct", "flash-wrong");
  void $imageWrap.offsetWidth;
  $imageWrap.classList.add(
    type === "correct" ? "flash-correct" : "flash-wrong",
  );
}

/* ── Fetch API ─────────────────────────────────────────────────── */
async function fetchCharacters() {
  const results = await Promise.all(
    PAGES_TO_FETCH.map((p) =>
      axios.get(`${API_BASE}/characters`, {
        params: { page: p, limit: 20 },
      }),
    ),
  );
  let all = [];
  results.forEach((r) => {
    const list = r.data.characters || r.data;
    if (Array.isArray(list)) all = all.concat(list);
  });
  return all.filter(
    (c) =>
      c.name &&
      c.images?.length > 0 &&
      c.images.some((url) => !BLOCKED_IMAGE_URLS.has(url)),
  );
}

/* ── Init & Restart ────────────────────────────────────────── */
async function initGame() {
  score = 0;
  streak = 0;
  roundNum = 0; // startRound will increment to 1
  attempts = 5;
  usedChars = new Set();

  show($loading);
  hide($error);
  hide($gameArea);
  hide($gameOver);

  try {
    if (allCharacters.length === 0) {
      allCharacters = await fetchCharacters();
    }
    hide($loading);
    show($gameArea);
    startRound();
  } catch (err) {
    hide($loading);
    show($error);
  }
}

/* ── Start Round ───────────────────────────────────────────── */
function startRound() {
  // Get remaining characters (not yet asked in this session)
  const remaining = allCharacters.filter((c) => !usedChars.has(c.name));
  if (remaining.length === 0) {
    // All characters exhausted — game ends gracefully
    usedChars = new Set();
    showGameOver();
    return;
  }

  currentChar = pickRandom(remaining);
  roundOver = false;
  isSubmitting = false;
  roundNum++;

  $guessInput.value = "";
  $guessInput.disabled = false;
  $submitBtn.disabled = false;

  show($guessSection);
  hide($feedbackCard);
  hide($suggestions);

  $charImg.src = currentChar.images[0];
  usedChars.add(currentChar.name);
  updateScoreboard();
  $guessInput.focus();
}

/* ── Submit Guess ─────────────────────────────────────────── */
function submitGuess() {
  if (roundOver || isSubmitting) return;

  const raw = $guessInput.value.trim();
  if (!raw) return;

  isSubmitting = true;
  $submitBtn.disabled = true;

  const isCorrect = normalize(raw) === normalize(currentChar.name);

  if (isCorrect) {
    score += 5;
    streak++;
    endRound(true);
  } else {
    streak = 0;
    attempts--;

    if (attempts <= 0) {
      endRound(false);
      setTimeout(showGameOver, 700);
    } else {
      endRound(false);
    }
  }
}

/* ── End Round ────────────────────────────────────────────── */
function endRound(won) {
  roundOver = true;
  $guessInput.disabled = true;

  flashImage(won ? "correct" : "wrong");

  $feedbackMsg.textContent = won
    ? "Benar!"
    : `Salah! Itu adalah ${currentChar.name}`;
  $feedbackMsg.className = won
    ? "feedback-msg correct"
    : "feedback-msg gameover";

  hide($guessSection);
  show($feedbackCard);
  updateScoreboard();
}

/* ── Game Over Screen ─────────────────────────────────────── */
function showGameOver() {
  roundOver = true;
  hide($gameArea);
  show($gameOver);

  $finalScoreEl.textContent = score;
  $gameoverMsg.textContent = `Kamu berhasil bertahan sampai ronde ${roundNum}.`;
}

/* ── Autocomplete ─────────────────────────────────────────── */
function updateSuggestions(val) {
  if (!val || val.length < 2) {
    hide($suggestions);
    return;
  }
  const matches = allCharacters
    .filter((c) => normalize(c.name).includes(normalize(val)))
    .slice(0, 8);
  if (!matches.length) {
    hide($suggestions);
    return;
  }
  $suggestions.innerHTML = matches
    .map((c) => `<li data-name="${c.name}">${c.name}</li>`)
    .join("");
  show($suggestions);
}

/* ── Events ───────────────────────────────────────────────── */
$guessInput.addEventListener("input", () =>
  updateSuggestions($guessInput.value),
);

$guessInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const active = $suggestions.querySelector("li.active");
    if (active) {
      $guessInput.value = active.dataset.name;
      hide($suggestions);
    } else {
      submitGuess();
    }
  }
});

$suggestions.addEventListener("mousedown", (e) => {
  const li = e.target.closest("li");
  if (li) {
    $guessInput.value = li.dataset.name;
    hide($suggestions);
  }
});

$submitBtn.addEventListener("click", submitGuess);
$nextBtn.addEventListener("click", () => startRound());
$restartBtn.addEventListener("click", initGame);

document.addEventListener("click", (e) => {
  if (!$guessInput.contains(e.target) && !$suggestions.contains(e.target))
    hide($suggestions);
});

initGame();
