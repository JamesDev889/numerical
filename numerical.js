
// The deck of cards, one for each suit and rank
const deck = [
  // Hearts
  '2-H', '3-H', '4-H', '5-H', '6-H', '7-H', '8-H', '9-H', '10-H', 'J-H', 'Q-H', 'K-H', 'A-H',
  // Diamonds
  '2-D', '3-D', '4-D', '5-D', '6-D', '7-D', '8-D', '9-D', '10-D', 'J-D', 'Q-D', 'K-D', 'A-D',
  // Clubs
  '2-C', '3-C', '4-C', '5-C', '6-C', '7-C', '8-C', '9-C', '10-C', 'J-C', 'Q-C', 'K-C', 'A-C',
  // Spades
  '2-S', '3-S', '4-S', '5-S', '6-S', '7-S', '8-S', '9-S', '10-S', 'J-S', 'Q-S', 'K-S', 'A-S'
];


const drawButton = document.getElementById('draw-button');
const drawnCard = document.getElementById('drawn-card');
const newGameButton = document.getElementById('new-game-button');

// Resets the game to its initial state, including the deck, slots, and UI
newGameButton.addEventListener('click', () => {
  // Reset deck to full
  deck.length = 0;
  deck.push(
    // Hearts
    '2-H', '3-H', '4-H', '5-H', '6-H', '7-H', '8-H', '9-H', '10-H', 'J-H', 'Q-H', 'K-H', 'A-H',
    // Diamonds
    '2-D', '3-D', '4-D', '5-D', '6-D', '7-D', '8-D', '9-D', '10-D', 'J-D', 'Q-D', 'K-D', 'A-D',
    // Clubs
    '2-C', '3-C', '4-C', '5-C', '6-C', '7-C', '8-C', '9-C', '10-C', 'J-C', 'Q-C', 'K-C', 'A-C',
    // Spades
    '2-S', '3-S', '4-S', '5-S', '6-S', '7-S', '8-S', '9-S', '10-S', 'J-S', 'Q-S', 'K-S', 'A-S'
  );

  // Reset drawn card
  drawnCard.src = 'cards/back.png';
  drawnCard.alt = 'Card Back';
  drawnCardValue = null;

  // Reset placed cards and draw count
  placedCards = [null, null, null, null, null];
  drawCount = 0;

  // Reset total points
  totalPoints = 0;

  // Reset slots
  const slots = document.querySelectorAll('.slot');
  slots.forEach(slot => {
    slot.src = 'cards/back.png';
    slot.alt = 'Card Back';
    slot.dataset.filled = '';
    slot.style.pointerEvents = '';
  });

  // Reset message
  if (message) {
    message.textContent = '';
    message.style.color = 'white';
  }

  // Enable draw button
  drawButton.disabled = false;
});


let drawnCardValue = null; // Stores the currently drawn card
let placedCards = [null, null, null, null, null]; // Tracks cards placed in slots
let drawCount = 0; // Counts how many cards have been drawn in the current round
let totalPoints = 0; // Running total of points (streaks)


/**
 * Converts a card string (e.g., 'A-H', '10-D') to its numeric value.
 * Returns an array for Ace ([1, 14]) to support both low and high.
 * @param {string} card
 * @returns {number|number[]}
 */
function getCardValue(card) {
  const rank = card.split('-')[0];
  if (rank === 'J') return 11;
  if (rank === 'Q') return 12;
  if (rank === 'K') return 13;

  if (rank === 'A') return [1, 14]; // Ace can be 1 or 14
  return parseInt(rank);
}


const message = document.getElementById('message');


/**
 * Given an array of card values (some may be arrays for Ace),
 * returns all possible value combinations (for Ace as 1 or 14).
 * @param {Array<number|number[]>} values
 * @returns {number[][]}
 */
function getAllValueCombos(values) {
  let combos = [[]];
  for (const val of values) {
    if (Array.isArray(val)) {
      combos = combos.flatMap(combo => val.map(v => [...combo, v]));
    } else {
      combos = combos.map(combo => [...combo, val]);
    }
  }
  return combos;
}

/**
 * Checks if all placed cards form a valid non-decreasing sequence (with Ace as 1 or 14).
 * If so, increments streak and resets the board for a new round.
 * Otherwise, ends the game and displays the final score.
 */
function checkForWin() {
  if (placedCards.every(card => card !== null)) {
    const values = placedCards.map(getCardValue);
    const combos = getAllValueCombos(values);
    const isOrdered = combos.some(arr =>
      arr.every((val, i) => i === 0 || arr[i] >= arr[i - 1])
    );
    if (isOrdered) {
      totalPoints++;
      message.textContent = `Current Streak: ${totalPoints}`;
      message.style.color = "white";
      resetBoardForNextRound();
    } else {
      message.textContent = `Final Score: ${totalPoints}`;
      message.style.color = "white";
      drawButton.disabled = true;
    }
  }
}

/**
 * Resets the slots and state for a new round, but keeps the deck and points.
 */
function resetBoardForNextRound() {
  placedCards = [null, null, null, null, null];
  drawCount = 0;
  drawnCardValue = null;
  // Reset slots
  const slots = document.querySelectorAll('.slot');
  slots.forEach(slot => {
    slot.src = 'cards/back.png';
    slot.alt = 'Card Back';
    slot.dataset.filled = '';
    slot.style.pointerEvents = '';
  });
  // Reset drawn card
  drawnCard.src = 'cards/back.png';
  drawnCard.alt = 'Card Back';
  // Enable draw button
  drawButton.disabled = false;
}


/**
 * Handles the draw card button click: draws a random card, updates the UI, and disables the button until placed.
 */
drawButton.addEventListener('click', () => {
  if (deck.length === 0) {
    alert("No more cards!");
    return;
  }

  if (drawCount >= 5) {
    drawButton.disabled = true;
    return;
  }

  const randomIndex = Math.floor(Math.random() * deck.length);
  const selectedCard = deck[randomIndex];
  deck.splice(randomIndex, 1); // remove drawn card

  drawnCard.src = `cards/${selectedCard}.png`;
  drawnCard.alt = selectedCard;
  drawnCardValue = selectedCard;

  drawCount++;
  drawButton.disabled = true;
  if (drawCount === 5) {
    drawButton.disabled = true;
  }
  // No check here; only check after 5 cards are placed (see checkForWin)
});


/**
 * Handles slot clicks: places the drawn card in the clicked slot, updates state, and checks for win.
 */
const slots = document.querySelectorAll('.slot');
slots.forEach((slot, index) => {
  slot.addEventListener('click', () => {
    if (drawnCardValue && !slot.dataset.filled) {
      // Place the drawn card in clicked slot
      slot.src = `cards/${drawnCardValue}.png`;
      slot.alt = drawnCardValue;
      placedCards[index] = drawnCardValue;
      slot.dataset.filled = "true";
      drawnCard.src = 'cards/back.png';
      drawnCard.alt = 'Card Back';
      drawnCardValue = null;
      slot.style.pointerEvents = 'none';
      checkForWin();
      if (drawCount < 5) {
        drawButton.disabled = false;
      }
    }
  });
});