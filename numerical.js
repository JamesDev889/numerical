
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

/**
 * Shuffles an array in-place using the Fisher-Yates algorithm.
 * @param {any[]} array
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/**
 * Refill the deck to a full 52-card set and shuffle it.
 * Called on first load, New Game, and after each successful round.
 */
function refillAndShuffleDeck() {
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
  shuffleArray(deck);
}
// Shuffle once on initial load to start the first round
refillAndShuffleDeck();


// const drawButton = document.getElementById('draw-button');
const drawnCard = document.getElementById('drawn-card');
const newGameButton = document.getElementById('new-game-button');
const highScoreEl = document.getElementById('high-score');

// Resets the game to its initial state, including the deck, slots, and UI
newGameButton.addEventListener('click', () => {
  // Reset game over flag for new game
  window.numericalGameOver = false;
  // If button is temporarily disabled, ignore click
  if (newGameButton.classList.contains('temporarily-disabled')) return;
  // Disable New Game during shuffle animation and 1s after
  newGameButton.classList.add('temporarily-disabled');
  const slotsEls = Array.from(document.querySelectorAll('#slots-area .slot'));
  animateCardsBackToDeck(slotsEls).then(() => {
    setTimeout(() => {
      newGameButton.classList.remove('temporarily-disabled');
    }, 1000);
    // Reset and shuffle deck to full
    refillAndShuffleDeck();

    // Reset drawn card
    drawnCard.src = 'cards/back.png';
    drawnCard.alt = 'Card Back';
    drawnCardValue = null;

    // Reset placed cards and draw count
    placedCards = [null, null, null, null, null];
    drawCount = 0;

    // Reset total points (streak); keep in-memory high score (resets on reload)
    totalPoints = 0;
    if (highScoreEl) {
      highScoreEl.innerHTML = `<span style=\"color:#4a8ff0;\">High Score:</span> <span style=\"color:white;\">${highScore}</span>`;
    }

    // Reset slots to empty numbered rectangles
    const slots = document.querySelectorAll('.slot');
    slots.forEach((slot, i) => {
      slot.classList.remove('filled');
      slot.dataset.filled = '';
      slot.style.pointerEvents = '';
      slot.innerHTML = `<span class=\"slot-number\">${i + 1}</span>`;
    });

    // Reset message
    if (message) {
      message.innerHTML = '<span style="color:#ff8500;">Current Streak:</span> <span style="color:white;">0</span>';
    }

    // Draw the first card automatically for new game, after 1s delay
    setTimeout(() => {
      drawNewCard();
    }, 200);
  });
});


let drawnCardValue = null; // Stores the currently drawn card
let placedCards = [null, null, null, null, null]; // Tracks cards placed in slots
let drawCount = 0; // Counts how many cards have been drawn in the current round
let totalPoints = 0; // Running total of points (streaks)
let highScore = 0; // In-memory high score that resets on page reload

// Initialize high score display on load
if (highScoreEl) {
  highScoreEl.innerHTML = `<span style=\"color:#4a8ff0;\">High Score:</span> <span style=\"color:white;\">${highScore}</span>`;
}


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

// Set Current Streak to orange before the game starts
if (message) {
  message.innerHTML = '<span style="color:#ff8500;">Current Streak:</span> <span style="color:white;">0</span>';
}


/**
 * Animates any card images currently in the provided slots to fly back to the deck (drawn card) position.
 * Returns a Promise that resolves when all animations complete (including removal of clones).
 * @param {HTMLElement[]} slotsEls
 * @returns {Promise<void>}
 */
function animateCardsBackToDeck(slotsEls) {
  return new Promise(resolveOuter => {
    const deckTarget = drawnCard.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    const flyPromises = [];

    slotsEls.forEach(slot => {
      const img = slot.querySelector('img');
      if (!img) return; // only animate slots that have a card image
      const rect = img.getBoundingClientRect();
      const clone = img.cloneNode(true);
      clone.classList.add('flying-card');
      clone.style.left = `${rect.left + scrollX}px`;
      clone.style.top = `${rect.top + scrollY}px`;
      clone.style.transform = 'translate(0, 0)';
      clone.style.opacity = '1';
      document.body.appendChild(clone);

      // Force reflow then move towards deck
      // eslint-disable-next-line no-unused-expressions
      clone.offsetHeight;
      const dx = deckTarget.left - rect.left;
      const dy = deckTarget.top - rect.top;
      requestAnimationFrame(() => {
        clone.style.transform = `translate(${dx}px, ${dy}px) scale(0.6)`;
        clone.style.opacity = '0';
      });

      flyPromises.push(new Promise(resolve => {
        setTimeout(() => {
          clone.remove();
          resolve();
        }, 650);
      }));
    });

    if (flyPromises.length === 0) {
      resolveOuter();
      return;
    }
    Promise.all(flyPromises).then(() => resolveOuter());
  });
}

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
 * Checks if, given the current placed cards, there exists at least one empty slot
 * where placing the provided card keeps a non-decreasing sequence possible among
 * the already filled positions (ignoring empty slots).
 *
 * This ensures we don't continue a round if the just-drawn card would make it
 * impossible to ever complete a valid non-decreasing sequence.
 * @param {string} card
 * @returns {boolean}
 */
function canPlaceCardAnywhere(card) {
  // For each empty index, try placing and see if the filled subsequence can be non-decreasing
  for (let i = 0; i < placedCards.length; i++) {
    if (placedCards[i] !== null) continue;
    const hypothetical = placedCards.slice();
    hypothetical[i] = card;
    const filledValues = hypothetical
      .filter(c => c !== null)
      .map(getCardValue);
    const combos = getAllValueCombos(filledValues);
    const feasible = combos.some(arr => arr.every((val, idx) => idx === 0 || arr[idx] >= arr[idx - 1]));
    if (feasible) return true;
  }
  return false;
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
  message.innerHTML = `<span style=\"color:#ff8500;\">Current Streak:</span> <span style=\"color:white;\">${totalPoints}</span>`;
      // Update high score if needed (in-memory only; resets on reload)
      if (totalPoints > highScore) {
        highScore = totalPoints;
        if (highScoreEl) {
          highScoreEl.innerHTML = `<span style=\"color:#4a8ff0;\">High Score:</span> <span style=\"color:white;\">${highScore}</span>`;
        }
      }
      // Disable New Game during all animations
      newGameButton.classList.add('temporarily-disabled');
      const slotsEls = Array.from(document.querySelectorAll('#slots-area .slot'));
      slotsEls.forEach((el, idx) => {
        // Stagger via animationDelay
        el.style.animationDelay = `${idx * 80}ms`;
        el.classList.add('wave');
      });
      // After wave completes (2 * 700ms + stagger), clear wave then fly cards
      setTimeout(() => {
        slotsEls.forEach(el => {
          el.classList.remove('wave');
          el.style.animationDelay = '';
        });

        // Animate cards flying back to the deck position (drawn card location)
        const deckTarget = drawnCard.getBoundingClientRect();
        const containerScrollX = window.scrollX;
        const containerScrollY = window.scrollY;

        // Create flying clones from each filled slot image
        const flyPromises = [];
        slotsEls.forEach(slot => {
          const img = slot.querySelector('img');
          if (!img) return;
          const rect = img.getBoundingClientRect();
          const clone = img.cloneNode(true);
          clone.classList.add('flying-card');
          clone.style.left = `${rect.left + containerScrollX}px`;
          clone.style.top = `${rect.top + containerScrollY}px`;
          clone.style.transform = 'translate(0, 0)';
          clone.style.opacity = '1';
          document.body.appendChild(clone);

          // Force reflow then move towards deck
          // eslint-disable-next-line no-unused-expressions
          clone.offsetHeight;
          const dx = deckTarget.left - rect.left;
          const dy = deckTarget.top - rect.top;
          requestAnimationFrame(() => {
            clone.style.transform = `translate(${dx}px, ${dy}px) scale(0.6)`;
            clone.style.opacity = '0';
          });

          flyPromises.push(new Promise(resolve => {
            setTimeout(() => {
              clone.remove();
              resolve();
            }, 650);
          }));
        });

        Promise.all(flyPromises).then(() => {
          setTimeout(() => {
            newGameButton.classList.remove('temporarily-disabled');
          }, 1000);
          resetBoardForNextRound(() => {
            drawNewCard();
          });
        });
      }, 1700);
    } else {
    message.innerHTML = `<span style="color:red;">Game Over</span> | <span style="color:limegreen;">Final Score:</span> <span style="color:white;">${totalPoints}</span>`;
      message.style.color = "white";
      // Set a global flag to indicate game over
      window.numericalGameOver = true;
    }
  }
}

/**
 * Resets the slots and state for a new round, but keeps the deck and points.
 */
function resetBoardForNextRound(afterReset) {
  // Reset game over flag for new round
  window.numericalGameOver = false;
  // Start each round with a freshly shuffled full deck
  refillAndShuffleDeck();
  placedCards = [null, null, null, null, null];
  drawCount = 0;
  drawnCardValue = null;
  // Reset slots to empty numbered rectangles
  const slots = document.querySelectorAll('.slot');
  slots.forEach((slot, i) => {
    slot.classList.remove('filled');
    slot.dataset.filled = '';
    slot.style.pointerEvents = '';
    slot.innerHTML = `<span class="slot-number">${i + 1}</span>`;
  });
  // Reset drawn card
  drawnCard.src = 'cards/back.png';
  drawnCard.alt = 'Card Back';
  // Enable draw button
  // drawButton.disabled = false;
  if (typeof afterReset === 'function') afterReset();
}


/**
 * Handles the draw card button click: draws a random card, updates the UI, and disables the button until placed.
 */

function drawNewCard() {
  if (deck.length === 0) {
    alert("No more cards!");
    return;
  }
  if (drawCount >= 5) {
    return;
  }
  const selectedCard = deck.pop();
  drawnCard.src = `cards/${selectedCard}.png`;
  drawnCard.alt = selectedCard;
  drawnCardValue = selectedCard;
  if (!canPlaceCardAnywhere(drawnCardValue)) {
    message.innerHTML = `<span style="color:red;">Game Over</span> | <span style="color:limegreen;">Final Score:</span> <span style="color:white;">${totalPoints}</span>`;
    message.style.color = 'white';
    // Disable all slots to prevent further interaction
    const allSlots = document.querySelectorAll('.slot');
    allSlots.forEach(slot => {
      slot.style.pointerEvents = 'none';
    });
    return;
  }
  drawCount++;
}


/**
 * Handles slot clicks: places the drawn card in the clicked slot, updates state, and checks for win.
 */
const slots = document.querySelectorAll('.slot');
slots.forEach((slot, index) => {
  slot.addEventListener('click', () => {
    if (drawnCardValue && !slot.dataset.filled) {
      // Place the drawn card in clicked slot
      slot.innerHTML = '';
      const img = document.createElement('img');
      img.src = `cards/${drawnCardValue}.png`;
      img.alt = drawnCardValue;
      slot.appendChild(img);
      slot.classList.add('filled');
      placedCards[index] = drawnCardValue;
      slot.dataset.filled = "true";
      drawnCard.src = 'cards/back.png';
      drawnCard.alt = 'Card Back';
      drawnCardValue = null;
      slot.style.pointerEvents = 'none';
      // Check if the game is still winnable after this placement
      let stillPossible = false;
      const filledValues = placedCards.filter(c => c !== null).map(getCardValue);
      const combos = getAllValueCombos(filledValues);
      stillPossible = combos.some(arr => arr.every((val, idx) => idx === 0 || arr[idx] >= arr[idx - 1]));
      if (!stillPossible) {
        message.textContent = `Game Over | Final Score: ${totalPoints}`;
        message.style.color = 'white';
        const allSlots = document.querySelectorAll('.slot');
        allSlots.forEach(slot => { slot.style.pointerEvents = 'none'; });
        window.numericalGameOver = true;
        return;
      }
      checkForWin();
      // Only draw a new card if the game is not over
      if (!window.numericalGameOver && drawCount < 5) {
        setTimeout(() => {
          drawNewCard();
        }, 200); // 200ms delay after placing a card
      }
    }
  });
});