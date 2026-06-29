const API = 'http://localhost:3000'; // Your backend URL

// ── State ─────────────────────────────────────────────────────────────────────
// Everything the app needs to remember while a game is running
let state = {
  token: null,          // Session token from backend
  imageUrl: null,       // Which image is being played
  characters: [],       // Array of { id, name } to find
  foundIds: [],         // Character IDs the user has found so far
  timerInterval: null,  // setInterval reference so we can stop it
  secondsElapsed: 0,    // Running count of seconds
};

// ── DOM References ────────────────────────────────────────────────────────────
const pickerScreen     = document.getElementById('picker-screen');
const gameScreen       = document.getElementById('game-screen');
const endScreen        = document.getElementById('end-screen');
const imageList        = document.getElementById('image-list');
const gameImage        = document.getElementById('game-image');
const imageWrapper     = document.getElementById('image-wrapper');
const targetingBox     = document.getElementById('targeting-box');
const charDropdown     = document.getElementById('character-dropdown');
const charsToFind      = document.getElementById('characters-to-find');
const timeDisplay      = document.getElementById('time-display');
const finalTime        = document.getElementById('final-time');
const nameInput        = document.getElementById('name-input');
const saveScoreBtn     = document.getElementById('save-score-btn');
const playAgainBtn     = document.getElementById('play-again-btn');
const leaderboardList  = document.getElementById('leaderboard-list');

// ── Toast (feedback message) ──────────────────────────────────────────────────
// Create the toast element once and reuse it
const toast = document.createElement('div');
toast.id = 'toast';
document.body.appendChild(toast);

function showToast(message, duration = 2000) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// ── Step 1: Load image picker ─────────────────────────────────────────────────
async function loadImagePicker() {
  try {
    const res = await fetch(`${API}/images`);
    const images = await res.json(); // [{ url, characters: [{id, name}] }, ...]

    imageList.innerHTML = '';

    images.forEach(img => {
      // Build a card for each image
      const card = document.createElement('div');
      card.className = 'image-card';
      card.innerHTML = `
        <img src="${img.url}" alt="Level" />
        <p>Find: ${img.characters.map(c => c.name).join(', ')}</p>
      `;
      // Clicking the card starts that level
      card.addEventListener('click', () => startGame(img));
      imageList.appendChild(card);
    });

  } catch (err) {
    imageList.innerHTML = '<p>Failed to load levels. Is the backend running?</p>';
    console.error(err);
  }
}

// ── Step 2: Start a game ──────────────────────────────────────────────────────
async function startGame(img) {
  // Tell the backend to create a session and give us a token
  const res = await fetch(`${API}/session/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageUrl: img.url })
  });
  const data = await res.json();

  // Save everything we need into state
  state.token       = data.token;
  state.imageUrl    = img.url;
  state.characters  = img.characters;
  state.foundIds    = [];
  state.secondsElapsed = 0;

  // Set up the game image
  gameImage.src = img.url;

  // Build the top bar character badges
  buildCharacterBadges();

  // Build the dropdown items (one per character)
  buildDropdown();

  // Switch screens
  pickerScreen.classList.add('hidden');
  endScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');

  // Start the timer
  clearInterval(state.timerInterval);
  state.timerInterval = setInterval(() => {
    state.secondsElapsed++;
    timeDisplay.textContent = state.secondsElapsed;
  }, 1000);
}

// ── Build top-bar badges ──────────────────────────────────────────────────────
function buildCharacterBadges() {
  charsToFind.innerHTML = '';
  state.characters.forEach(c => {
    const badge = document.createElement('span');
    badge.className = 'char-badge';
    badge.id = `badge-${c.id}`;
    badge.textContent = c.name;
    charsToFind.appendChild(badge);
  });
}

// ── Build dropdown list ───────────────────────────────────────────────────────
function buildDropdown() {
  charDropdown.innerHTML = '';
  state.characters.forEach(c => {
    const li = document.createElement('li');
    li.textContent = c.name;
    li.dataset.id = c.id; // Store the ID so we can send it to the backend
    charDropdown.appendChild(li);
  });
}

// ── Step 3: Handle image clicks ───────────────────────────────────────────────
gameImage.addEventListener('click', (e) => {
  // Get where the user clicked, as a % of the image size
  const rect = gameImage.getBoundingClientRect();

  // Pixel position of click within the image
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  // Convert to percentage (works on any screen size)
  const xPercent = (clickX / rect.width)  * 100;
  const yPercent = (clickY / rect.height) * 100;

  // Position the targeting box at the click point
  // We use % so it stays in the right place if the window is resized
  targetingBox.style.left = `${xPercent}%`;
  targetingBox.style.top  = `${yPercent}%`;

  // Save the click position on the targeting box element
  // so the dropdown handler can read it later
  targetingBox.dataset.x = xPercent;
  targetingBox.dataset.y = yPercent;

  // Update dropdown to only show unfound characters
  updateDropdownItems();

  // Show the targeting box
  targetingBox.classList.remove('hidden');

  // Stop the click from bubbling up to the document listener below
  e.stopPropagation();
});

// Hide the targeting box if user clicks anywhere else
document.addEventListener('click', () => {
  targetingBox.classList.add('hidden');
});

// Clicking inside the targeting box shouldn't close it
targetingBox.addEventListener('click', (e) => {
  e.stopPropagation();
});

// ── Update dropdown to hide already-found characters ──────────────────────────
function updateDropdownItems() {
  const items = charDropdown.querySelectorAll('li');
  items.forEach(li => {
    const id = parseInt(li.dataset.id);
    // Hide characters the user has already found
    li.style.display = state.foundIds.includes(id) ? 'none' : 'block';
  });
}

// ── Step 4: Handle character selection ───────────────────────────────────────
charDropdown.addEventListener('click', async (e) => {
  const li = e.target.closest('li');
  if (!li) return;

  const characterId = parseInt(li.dataset.id);
  const xPercent    = parseFloat(targetingBox.dataset.x);
  const yPercent    = parseFloat(targetingBox.dataset.y);

  // Hide the targeting box immediately
  targetingBox.classList.add('hidden');

  // Ask the backend if this was correct
  try {
    const res = await fetch(`${API}/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: state.token,
        characterId,
        xPercent,
        yPercent
      })
    });
    const data = await res.json();

    if (data.correct) {
      showToast(`✅ Found ${li.textContent}!`);

      // Mark badge as found
      const badge = document.getElementById(`badge-${characterId}`);
      if (badge) badge.classList.add('found');

      // Place a marker on the image at the character's real position
      placeMarker(data.markerX, data.markerY, li.textContent);

      // Record as found
      state.foundIds.push(characterId);

      // If all found, end the game
      if (data.gameComplete) endGame();

    } else {
      showToast(`❌ ${data.message}`);
    }

  } catch (err) {
    console.error(err);
    showToast('Error contacting server.');
  }
});

// ── Place a marker on the image ───────────────────────────────────────────────
function placeMarker(xPercent, yPercent, name) {
  const marker = document.createElement('div');
  marker.className = 'marker';
  marker.title = name; // Tooltip on hover

  // Position using the same % system as the click
  marker.style.left = `${xPercent}%`;
  marker.style.top  = `${yPercent}%`;

  // Add a checkmark inside
  marker.textContent = '✓';

  imageWrapper.appendChild(marker);
}

// ── Step 5: End the game ──────────────────────────────────────────────────────
async function endGame() {
  // Stop the timer
  clearInterval(state.timerInterval);

  // Show the final time
  finalTime.textContent = state.secondsElapsed;

  // Load the leaderboard
  await loadLeaderboard();

  // Show the end screen
  endScreen.classList.remove('hidden');
}

// ── Save score ────────────────────────────────────────────────────────────────
saveScoreBtn.addEventListener('click', async () => {
  const name = nameInput.value.trim();
  if (!name) { showToast('Please enter your name!'); return; }

  try {
    await fetch(`${API}/leaderboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: state.token, playerName: name })
    });

    showToast('Score saved!');
    saveScoreBtn.disabled = true;

    // Reload leaderboard to show the new score
    await loadLeaderboard();

  } catch (err) {
    console.error(err);
    showToast('Failed to save score.');
  }
});

// ── Load leaderboard ──────────────────────────────────────────────────────────
async function loadLeaderboard() {
  try {
    // Encode the imageUrl as base64 to safely put it in the URL
    const encoded = btoa(state.imageUrl);
    const res = await fetch(`${API}/leaderboard/${encoded}`);
    const scores = await res.json();

    leaderboardList.innerHTML = '';

    if (scores.length === 0) {
      leaderboardList.innerHTML = '<li>No scores yet.</li>';
      return;
    }

    scores.forEach(s => {
      const li = document.createElement('li');
      li.textContent = `${s.player_name} — ${s.seconds}s`;
      leaderboardList.appendChild(li);
    });

  } catch (err) {
    console.error(err);
  }
}

// ── Play again ────────────────────────────────────────────────────────────────
playAgainBtn.addEventListener('click', () => {
  // Remove all markers from the image
  imageWrapper.querySelectorAll('.marker').forEach(m => m.remove());

  // Reset inputs
  nameInput.value = '';
  saveScoreBtn.disabled = false;

  // Go back to the picker
  endScreen.classList.add('hidden');
  gameScreen.classList.add('hidden');
  pickerScreen.classList.remove('hidden');
});

// ── Kick everything off ───────────────────────────────────────────────────────
loadImagePicker();