const gameBoard = document.getElementById("game-board");
const restartButton = document.getElementById("restart");
const timerElement = document.getElementById("timer");
const volumeControl = document.getElementById("volume-control");
const muteButton = document.getElementById("mute-button");

const images = [
  'A Tribe Called Quest.jpg', 'AZ.jpg', 'Big Pun.jpg', 'Biggie.jpg',
  'Bone Thugs.jpg', 'Common.jpg', 'Eazy E.jpg', 'Eminem.jpg',
  'MF DOOM.jpg', 'Nas.jpg', 'Pharcyde.jpg', 'Rakim.jpg',
  'Slick Rick.jpg', 'Tech N9ne.jpg', 'Tupac.jpg', 'Big L.jpg', 'Souls Of Mischief.jpg', 'Del The Funky.jpg'
];

// Load sound effects
const flipSound = new Audio('sounds/flip.mp3');
const matchSound = new Audio('sounds/match.mp3');
const winSound = new Audio('sounds/win.mp3');

let isMuted = false;

// Function to set volume
function setVolume(volume) {
  flipSound.volume = volume;
  matchSound.volume = volume;
  winSound.volume = volume;
}

// Set initial volume
setVolume(volumeControl.value);

// Listen for volume change events
volumeControl.addEventListener("input", () => {
  if (!isMuted) {
    setVolume(volumeControl.value);
  }
});

// Mute/Unmute functionality
muteButton.addEventListener("click", () => {
  if (isMuted) {
    setVolume(volumeControl.value); // Restore volume to current slider value
    muteButton.textContent = "Mute";
  } else {
    setVolume(0); // Mute all sounds
    muteButton.textContent = "Unmute";
  }
  isMuted = !isMuted;
});

let timer;
let seconds = 0;
let flippedCards = [];
let matchedCards = [];

// Shuffle the array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Start a new game
function startGame() {
  gameBoard.innerHTML = '';
  flippedCards = [];
  matchedCards = [];
  seconds = 0;

  winSound.play();
  setTimeout(() =>
     {
    winSound.pause();
    winSound.currentTime = 0;  // Reset the audio to the beginning
  }, 200000);



  // Duplicate and shuffle images
  const deck = [...images, ...images]; // Create pairs
  shuffle(deck);

  // Generate cards
  deck.forEach(img => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.name = img;

    const cardInner = document.createElement('div');
    cardInner.classList.add('card-inner');

    const cardFront = document.createElement('div');
    cardFront.classList.add('card-front');

    const cardBack = document.createElement('div');
    cardBack.classList.add('card-back');

    const imgElement = document.createElement('img');
    imgElement.src = `images/${img}`;
    imgElement.alt = img;
    cardFront.appendChild(imgElement);

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);

    card.addEventListener('click', flipCard);
    gameBoard.appendChild(card);
  });

  // Reset timer
  clearInterval(timer);
  timerElement.textContent = `Time: 0s`;
  timer = setInterval(updateTimer, 1000);
}

// Flip a card
function flipCard() {
  if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
    if (!isMuted) flipSound.play(); // Play flip sound if not muted
    this.classList.add('flipped');
    flippedCards.push(this);

    if (flippedCards.length === 2) {
      checkMatch();
    }
  }
}

// Check for a match
function checkMatch() {
  const [card1, card2] = flippedCards;
  if (card1.dataset.name === card2.dataset.name) {
    if (!isMuted) matchSound.play(); // Play match sound if not muted
    matchedCards.push(card1.dataset.name);
    flippedCards = [];
    if (matchedCards.length === images.length) {
      clearInterval(timer);
      if (!isMuted) winSound.play(); // Play win sound if not muted
      alert(`You win! Time: ${seconds}s`);
    }
  } else {
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      flippedCards = [];
    }, 1000);
  }
}

// Update timer
function updateTimer() {
  seconds++;
  timerElement.textContent = `Time: ${seconds}s`;
}

// Restart the game
restartButton.addEventListener('click', startGame);

// Start the game on load
startGame();
