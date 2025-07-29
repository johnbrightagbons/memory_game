// Get DOM elements
const gameBoard = document.getElementById("game-board");
const movesDisplay = document.getElementById("moves");
const timerDisplay = document.getElementById("timer");
const message = document.getElementById("message");
const playAgainBtn = document.getElementById("play-again");
const cancelBtn = document.getElementById("cancel-game");

// Emoji pairs for cards
const emojis = ["🍕", "🍔", "🍟", "🌭", "🥪", "🍿", "🍩", "🍪"];

// Game state
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matchCount = 0;
let timer = 0;
let timerInterval = null;

// Shuffle function (using ES6)
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Recursively clear board and game state
function clearGameBoard(node) {
  if (!node.hasChildNodes()) return;
  [...node.childNodes].forEach((child) => {
    clearGameBoard(child);
    node.removeChild(child);
  });
}

// Timer handler
function startTimer() {
  clearInterval(timerInterval);
  timer = 0;
  timerDisplay.textContent = "Time: 0s";
  timerInterval = setInterval(() => {
    timer++;
    timerDisplay.textContent = `Time: ${timer}s`;
  }, 1000);
}

// Setup game logic —flipping cards and checking for matches
function setupGame() {
  try {
    clearGameBoard(gameBoard);
    message.innerHTML = "";
    [firstCard, secondCard] = [null, null];
    moves = 0;
    matchCount = 0;
    movesDisplay.textContent = "Moves: 0";
    startTimer();

    const cards = shuffle([...emojis, ...emojis]);

    cards.forEach((emoji) => {
      const card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = `
        <div class="card-inner">
          <div class="card-front">${emoji}</div>
          <div class="card-back">❓</div>
        </div>
      `;

      card.addEventListener("click", () => flipCard(card, emoji));
      gameBoard.appendChild(card);
    });
  } catch (error) {
    Swal.fire("Error!", "There was an issue setting up the game.", "error");
  }
}

// Handle card flip
function flipCard(card, emoji) {
  if (lockBoard || card.classList.contains("flipped")) return;

  card.classList.add("flipped");

  if (!firstCard) {
    firstCard = { card, emoji };
    return;
  }

  secondCard = { card, emoji };
  lockBoard = true;
  moves++;
  movesDisplay.textContent = `Moves: ${moves}`;

  if (firstCard.emoji === secondCard.emoji) {
    matchCount++;
    resetTurn();

    if (matchCount === emojis.length) {
      clearInterval(timerInterval);
      Swal.fire(
        "🎉 Congratulations!",
        `Moves: ${moves}, Time: ${timer}s`,
        "success"
      );
    }
  } else {
    setTimeout(() => {
      firstCard.card.classList.remove("flipped");
      secondCard.card.classList.remove("flipped");
      resetTurn();
    }, 1000);
  }
}

// Reset flipped cards
function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

// Cancel game
cancelBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  clearGameBoard(gameBoard);
  message.innerHTML = `
    <p style='text-align:center; font-size:1.5rem; color:red;'>
      Game cancelled. Click "Play Again" to restart.
    </p>
  `;
});

// Restart game
playAgainBtn.addEventListener("click", () => {
  setupGame();
});

// Start game on load
setupGame();
