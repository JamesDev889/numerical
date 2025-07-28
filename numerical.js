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
newGameButton.addEventListener('click', () => {
    location.reload();
});

let drawnCardValue = null; // store currently drawn card
let placedCards = [null, null, null, null, null]; // track cards placed in slots
let drawCount = 0; // count how many cards drawn

// Helper: Convert card rank to number
function getCardValue(card) {
  const rank = card.split('-')[0];
  if (rank === 'J') return 11;
  if (rank === 'Q') return 12;
  if (rank === 'K') return 13;
  if (rank === 'A') return [1, 14]; // Ace can be 1 or 14
  return parseInt(rank);
}

const message = document.getElementById('message');

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

function checkForWin() {
  if (placedCards.every(card => card !== null)) {
    const values = placedCards.map(getCardValue);
    const combos = getAllValueCombos(values);
    const isOrdered = combos.some(arr =>
      arr.every((val, i) => i === 0 || arr[i] >= arr[i - 1])
    );
    if (isOrdered) {
      message.textContent = "You win!";
      message.style.color = "lime";
    } else {
      message.textContent = "You lose!";
      message.style.color = "red";
    }
  }
}

// Draw card button click
drawButton.addEventListener('click', () => {
  if (deck.length === 0) {
    alert("No more cards!");
    return;
  }

  if (drawCount >= 5) {
    // Disable draw button if 5 cards already drawn
    drawButton.disabled = true;
    return;
  }

  const randomIndex = Math.floor(Math.random() * deck.length);
  const selectedCard = deck[randomIndex];
  deck.splice(randomIndex, 1); // remove drawn card

  drawnCard.src = `cards/${selectedCard}.png`;
  drawnCard.alt = selectedCard;
  drawnCardValue = selectedCard;

  drawCount++; // increment draw count

  // Disable draw button until card is placed
  drawButton.disabled = true;

  // Also disable permanently if 5 cards drawn now
  if (drawCount === 5) {
    drawButton.disabled = true;
  }
});

// Handle slot clicks
const slots = document.querySelectorAll('.slot');

slots.forEach((slot, index) => {
  slot.addEventListener('click', () => {
    if (drawnCardValue && !slot.dataset.filled) {  // check if slot already filled
      // Place the drawn card in clicked slot
      slot.src = `cards/${drawnCardValue}.png`;
      slot.alt = drawnCardValue;

      placedCards[index] = drawnCardValue; // track card

      // Mark slot as filled
      slot.dataset.filled = "true";

      // Reset drawn card to back image
      drawnCard.src = 'cards/back.png';
      drawnCard.alt = 'Card Back';

      drawnCardValue = null;

      // Disable slot so it can't be changed again (extra safety)
      slot.style.pointerEvents = 'none';

      // After placing 5 cards, check win condition
      checkForWin();

      // Enable draw button again to draw next card only if less than 5 drawn
      if (drawCount < 5) {
        drawButton.disabled = false;
      }
    }
  });
});