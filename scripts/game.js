// Collection of card symbols for the game
const cardSymbols = ["🍎", "🍌", "🍒", "🍓", "🍕", "🍦", "🍩", "🎮"];

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let gameStarted = false;
let gameTimer;
let seconds = 0;
let hintTimeout;

const gameBoard = document.getElementById("game-board");
const movesDisplay = document.getElementById("moves");
const matchesDisplay = document.getElementById("matches");
const timerDisplay = document.getElementById("time");
const newGameBtn = document.getElementById("new-game");
const hintBtn = document.getElementById("hint");
const winMessage = document.getElementById("win-message");
const overlay = document.getElementById("overlay");
const finalTimeDisplay = document.getElementById("final-time");
const finalMovesDisplay = document.getElementById("final-moves");
const playAgainBtn = document.getElementById("play-again");

/**
 * Initialize a new game
 */
function initGame() {
  // Reset variables
  cards = [];
  flippedCards = [];
  matchedPairs = 0;
  moves = 0;
  seconds = 0;
  gameStarted = false;

  clearInterval(gameTimer);
  clearTimeout(hintTimeout);

  // Reset displays
  movesDisplay.textContent = moves;
  matchesDisplay.textContent = matchedPairs;
  timerDisplay.textContent = "00:00";

  // Clear previous cards
  gameBoard.innerHTML = "";

  // Create shuffled deck
  const cardPairs = [...cardSymbols, ...cardSymbols];
  const shuffledSymbols = _.shuffle(cardPairs);

  // Generate cards
  shuffledSymbols.forEach((symbol, index) => {
    const card = document.createElement("div");
    card.className = "card";

    // Store data
    card.dataset.symbol = symbol;
    card.dataset.index = index;

    // Inner HTML with front/back faces
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">${symbol}</div>
        <div class="card-back">?</div>
      </div>`;

    // Append to game board
    gameBoard.appendChild(card);
    cards.push(card);

    // Attach click event
    card.addEventListener("click", () => flipCard(card));
  });
}

/**
 * Flip card handler
 */
function flipCard(card) {
  console.log("Clicked card:", card);
  // Ignore if already flipped or matched
  if (
    card.classList.contains("flipped") ||
    card.classList.contains("matched")
  ) {
    console.log("Ignoring flip: already flipped or matched");
    return;
  }

  // Start timer on first move
  if (!gameStarted) {
    startTimer();
    gameStarted = true;
  }

  // Add flip class
  card.classList.add("flipped");
  console.log("Class added 'flipped':", card.classList.contains("flipped"));

  // Store flipped card
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    // Increment move count
    moves++;
    movesDisplay.textContent = moves;

    const [card1, card2] = flippedCards;
    // Check for match
    if (card1.dataset.symbol === card2.dataset.symbol) {
      // Match found
      card1.classList.add("matched");
      card2.classList.add("matched");
      flippedCards = [];
      matchedPairs++;
      matchesDisplay.textContent = matchedPairs;

      // Check for game win
      if (matchedPairs === cardSymbols.length) {
        showWinMessage();
      }
    } else {
      // No match, flip back after delay
      setTimeout(() => {
        console.log("Flipping back:", card1, card2);
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        flippedCards = [];
      }, 1000);
    }
  }
}

// Timer function //
function startTimer() {
  gameTimer = setInterval(() => {
    seconds++;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    timerDisplay.textContent = `${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }, 1000);
}

// Show hint: flip all non-matched cards briefly //
function showHint() {
  if (!gameStarted) return;

  // Disable clicks during hint
  cards.forEach((card) => {
    card.style.pointerEvents = "none";
  });

  // Flip all non-matched cards face-up
  cards.forEach((card) => {
    if (!card.classList.contains("matched")) {
      card.classList.add("flipped");
    }
  });

  // Flip back after 1 second
  hintTimeout = setTimeout(() => {
    cards.forEach((card) => {
      if (!card.classList.contains("matched")) {
        card.classList.remove("flipped");
      }
    });
    // Re-enable clicks
    cards.forEach((card) => {
      card.style.pointerEvents = "auto";
    });
  }, 1000);
}

// Show Win Message //
function showWinMessage() {
  clearInterval(gameTimer);
  finalTimeDisplay.textContent = timerDisplay.textContent;
  finalMovesDisplay.textContent = moves;
  winMessage.style.display = "block";
  overlay.style.display = "block";
}

// Event Listeners Play Again Functionalty //
document.getElementById("play-again").addEventListener("click", () => {
  winMessage.style.display = "none";
  overlay.style.display = "none";
  initGame();
});
document.getElementById("new-game").addEventListener("click", initGame);
document.getElementById("hint").addEventListener("click", showHint);

// Cancel Button Functionality
document.getElementById("cancel").addEventListener("click", () => {
  // Stop timer and any hint timeout
  clearInterval(gameTimer);
  clearTimeout(hintTimeout);

  // Hide game overlay and win message (if visible)
  overlay.style.display = "none";
  winMessage.style.display = "none";

  // Clears the game board //
  gameBoard.innerHTML = `
  <div style="
    text-align: center;
    padding: 2rem;
    font-size: 1.5rem;
    color: #fff;
    background-color: #ff4d4d;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    max-width: 400px;
    margin: 50px auto;
  ">
    <p>🚫 Game Cancelled</p>
    <p>Refresh the page to play again.</p>
  </div>
`;
  //  Reset displays //
  movesDisplay.textContent = "0";
  matchesDisplay.textContent = "0";
  timerDisplay.textContent = "00:00";
});

// Initialize on page load
window.addEventListener("load", initGame);
