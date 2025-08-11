// Make Free Space button a toggle: green border stays while active
const freeSpaceButton = document.getElementById('free-space-button');
if (freeSpaceButton) {
  freeSpaceButton.addEventListener('click', () => {
    freeSpaceButton.classList.toggle('active');
    // Clear the board/UI but do not start a new game or shuffle the deck
    // Reset slots to empty numbered rectangles
    const slots = document.querySelectorAll('.slot');
    slots.forEach((slot, i) => {
      slot.classList.remove('filled');
      slot.dataset.filled = '';
      slot.style.pointerEvents = '';
      slot.innerHTML = `<span class="slot-number">${i + 1}</span>`;
    });
    // Reset drawn card
    if (drawnCard) {
      drawnCard.src = 'cards/back.png';
      drawnCard.alt = 'Card Back';
    }
    // Reset placed cards and draw count
    placedCards = [null, null, null, null, null];
    freeSpaceCard = null;
    drawCount = 0;
    // Reset streak/message
    if (typeof totalPoints !== 'undefined') totalPoints = 0;
    if (message) {
      message.innerHTML = '<span style="color:#ff8500;">Current Streak:</span> <span style="color:white;">0</span>';
    }
    // Clear high score
    if (typeof highScore !== 'undefined') highScore = 0;
    if (highScoreEl) {
      highScoreEl.innerHTML = `<span style=\"color:#4a8ff0;\">High Score:</span> <span style=\"color:white;\">0</span>`;
    }

    // Toggle green free space slot next to the drawn card
    const cardArea = document.getElementById('card-area');
    const existingFreeSlot = document.getElementById('free-space-slot');
    if (freeSpaceButton.classList.contains('active')) {
      if (!existingFreeSlot && cardArea) {
        const freeSlot = document.createElement('div');
        freeSlot.id = 'free-space-slot';
        freeSlot.className = 'free-slot';
        freeSlot.innerHTML = '<span class="slot-number">FREE</span>';
                 cardArea.appendChild(freeSlot);
         
         // Add click handler for drawn card to toggle selection
         drawnCard.addEventListener('click', () => {
           if (freeSpaceCard && drawnCardValue) {
             // Toggle selection between drawn card and free space card
             if (freeSlot.classList.contains('active')) {
               // Switch selection to drawn card
               freeSlot.classList.remove('active');
               drawnCard.classList.add('active');
             } else {
               // Switch selection to free space card
               drawnCard.classList.remove('active');
               freeSlot.classList.add('active');
             }
           }
         });
         
         // Add click handler for free space slot
         freeSlot.addEventListener('click', () => {
           if (drawnCardValue && !freeSlot.dataset.filled) {
             // Place the drawn card in free space
             freeSlot.innerHTML = '';
             const img = document.createElement('img');
             img.src = `cards/${drawnCardValue}.png`;
             img.alt = drawnCardValue;
             freeSlot.appendChild(img);
             freeSlot.classList.add('filled');
             freeSpaceCard = drawnCardValue;
             freeSlot.dataset.filled = "true";
             drawnCard.src = 'cards/back.png';
             drawnCard.alt = 'Card Back';
             drawnCardValue = null;
             
             // Remove active class from drawn card and add to free space
             drawnCard.classList.remove('active');
             freeSlot.classList.add('active');
             
                           // Draw a new card after placing in free space
              const maxCards = freeSpaceButton && freeSpaceButton.classList.contains('active') ? 6 : 5;
              if (!window.numericalGameOver && drawCount < maxCards) {
                setTimeout(() => {
                  drawNewCard();
                }, 200);
              }
           } else if (freeSpaceCard && !drawnCardValue) {
             // Pick up card from free space
             drawnCardValue = freeSpaceCard;
             drawnCard.src = `cards/${freeSpaceCard}.png`;
             drawnCard.alt = freeSpaceCard;
             freeSpaceCard = null;
             freeSlot.innerHTML = '<span class="slot-number">FREE</span>';
             freeSlot.classList.remove('filled');
             freeSlot.dataset.filled = '';
             
             // Remove active class from free space and add to drawn card
             freeSlot.classList.remove('active');
             drawnCard.classList.add('active');
           } else if (freeSpaceCard && !drawnCardValue && !freeSlot.classList.contains('active')) {
             // If free space has a card and no drawn card, and free space is not active, make it active
             freeSlot.classList.add('active');
           } else if (freeSpaceCard && drawnCardValue) {
             // Toggle selection between drawn card and free space card
             if (drawnCard.classList.contains('active')) {
               // Switch selection to free space card
               drawnCard.classList.remove('active');
               freeSlot.classList.add('active');
             } else {
               // Switch selection to drawn card
               freeSlot.classList.remove('active');
               drawnCard.classList.add('active');
             }
           }
         });
      }
         } else if (existingFreeSlot) {
       // Return card to deck if free space is being removed
       if (freeSpaceCard) {
         freeSpaceCard = null;
       }
       existingFreeSlot.remove();
       
               // Remove active class from drawn card when free space is disabled
        drawnCard.classList.remove('active');
     }
  });
}

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

/**
 * Refill the deck to a full 52-card set excluding the free space card, and shuffle it.
 * Called after each successful round when free space is enabled.
 */
function refillAndShuffleDeckExcludingFreeSpace() {
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
  
  // Remove the free space card from the deck if it exists
  if (freeSpaceCard) {
    const index = deck.indexOf(freeSpaceCard);
    if (index > -1) {
      deck.splice(index, 1);
    }
  }
  
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
  
  // Collect all cards to animate back to deck (including free space card)
  const slotsEls = Array.from(document.querySelectorAll('#slots-area .slot'));
  const freeSpaceSlot = document.getElementById('free-space-slot');
  const cardsToAnimate = [...slotsEls];
  
  // Add free space card to animation if it exists
  if (freeSpaceSlot && freeSpaceSlot.classList.contains('filled')) {
    cardsToAnimate.push(freeSpaceSlot);
  }
  
  animateCardsBackToDeck(cardsToAnimate).then(() => {
    setTimeout(() => {
      newGameButton.classList.remove('temporarily-disabled');
    }, 1000);
    // Reset and shuffle deck to full
    refillAndShuffleDeck();

    // Reset drawn card
    drawnCard.src = 'cards/back.png';
    drawnCard.alt = 'Card Back';
    drawnCardValue = null;
    drawnCard.classList.remove('active');

    // Reset placed cards and draw count
    placedCards = [null, null, null, null, null];
    freeSpaceCard = null;
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

    // Reset free space slot if it exists
    if (freeSpaceSlot) {
      freeSpaceSlot.innerHTML = '<span class="slot-number">FREE</span>';
      freeSpaceSlot.classList.remove('filled');
      freeSpaceSlot.classList.remove('active');
      freeSpaceSlot.dataset.filled = '';
    }

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
let freeSpaceCard = null; // Stores the card in the free space slot
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
  // Check if card can be placed in any regular slot
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
  
  // If free space is enabled and empty, card can always be placed there
  if (freeSpaceButton && freeSpaceButton.classList.contains('active') && !freeSpaceCard) {
    return true;
  }
  
  return false;
}

/**
 * Checks if the game can continue with the current drawn card and free space card.
 * Game can continue if either card can be placed somewhere.
 */
function canGameContinue() {
  // If there's a drawn card that can be placed, game can continue
  if (drawnCardValue && canPlaceCardAnywhere(drawnCardValue)) {
    return true;
  }
  
  // If there's a free space card that can be placed in regular slots, game can continue
  if (freeSpaceCard && canPlaceInRegularSlots(freeSpaceCard)) {
    return true;
  }
  
  return false;
}

/**
 * Checks if a card can be placed in any regular slot (not including free space).
 */
function canPlaceInRegularSlots(card) {
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
  message.innerHTML = `<span style="color:red;">Game Over</span> <span style="color:white;">|</span> <span style="color:limegreen;">Final Score:</span> <span style="color:white;">${totalPoints}</span>`;
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
  
  // Check if free space is enabled and has a card
  const freeSpaceEnabled = freeSpaceButton && freeSpaceButton.classList.contains('active');
  const hasFreeSpaceCard = freeSpaceCard !== null;
  
  // If free space is enabled and has a card, exclude it from the deck
  if (freeSpaceEnabled && hasFreeSpaceCard) {
    refillAndShuffleDeckExcludingFreeSpace();
  } else {
    // Otherwise, use full deck (free space disabled or no card in free space)
    refillAndShuffleDeck();
    freeSpaceCard = null;
  }
  
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
  
  // Allow 6th card if free space is enabled, otherwise limit to 5
  const maxCards = freeSpaceButton && freeSpaceButton.classList.contains('active') ? 6 : 5;
  
  if (drawCount >= maxCards) {
    return;
  }
  const selectedCard = deck.pop();
  drawnCard.src = `cards/${selectedCard}.png`;
  drawnCard.alt = selectedCard;
  drawnCardValue = selectedCard;
  
  // Only add active class if free space is enabled
  if (freeSpaceButton && freeSpaceButton.classList.contains('active')) {
    drawnCard.classList.add('active');
    const freeSlot = document.getElementById('free-space-slot');
    if (freeSlot) {
      freeSlot.classList.remove('active');
    }
  }
  
  // Check if game can continue with current cards
  if (!canGameContinue()) {
    message.innerHTML = `<span style="color:red;">Game Over</span> <span style="color:white;">|</span> <span style="color:limegreen;">Final Score:</span> <span style="color:white;">${totalPoints}</span>`;
    message.style.color = 'white';
    // Disable all slots to prevent further interaction
    const allSlots = document.querySelectorAll('.slot');
    allSlots.forEach(slot => {
      slot.style.pointerEvents = 'none';
    });
    window.numericalGameOver = true;
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
    // Place drawn card if it's the active card or if free space is not enabled
    const freeSpaceEnabled = freeSpaceButton && freeSpaceButton.classList.contains('active');
    const canPlaceDrawnCard = drawnCardValue && !slot.dataset.filled && 
                              (!freeSpaceEnabled || drawnCard.classList.contains('active'));
    
    if (canPlaceDrawnCard) {
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
      drawnCard.classList.remove('active');
      slot.style.pointerEvents = 'none';
      
      // Check if the game is still winnable after this placement
      let stillPossible = false;
      const filledValues = placedCards.filter(c => c !== null).map(getCardValue);
      const combos = getAllValueCombos(filledValues);
      stillPossible = combos.some(arr => arr.every((val, idx) => idx === 0 || arr[idx] >= arr[idx - 1]));
      if (!stillPossible) {
  message.innerHTML = `<span style="color:red;">Game Over</span> <span style="color:white;">|</span> <span style="color:limegreen;">Final Score:</span> <span style="color:white;">${totalPoints}</span>`;
        const allSlots = document.querySelectorAll('.slot');
        allSlots.forEach(slot => { slot.style.pointerEvents = 'none'; });
        window.numericalGameOver = true;
        return;
      }
      checkForWin();
      // Only draw a new card if the game is not over and no win occurred
      const maxCards = freeSpaceButton && freeSpaceButton.classList.contains('active') ? 6 : 5;
      if (!window.numericalGameOver && drawCount < maxCards && !placedCards.every(card => card !== null)) {
        setTimeout(() => {
          drawNewCard();
        }, 200); // 200ms delay after placing a card
      }
    } else if (freeSpaceCard && document.getElementById('free-space-slot')?.classList.contains('active') && !slot.dataset.filled) {
      // Place the free space card in clicked slot
      slot.innerHTML = '';
      const img = document.createElement('img');
      img.src = `cards/${freeSpaceCard}.png`;
      img.alt = freeSpaceCard;
      slot.appendChild(img);
      slot.classList.add('filled');
      placedCards[index] = freeSpaceCard;
      slot.dataset.filled = "true";
      freeSpaceCard = null;
      slot.style.pointerEvents = 'none';
      
             // Clear the free space slot
       const freeSlot = document.getElementById('free-space-slot');
       if (freeSlot) {
         freeSlot.innerHTML = '<span class="slot-number">FREE</span>';
         freeSlot.classList.remove('filled');
         freeSlot.classList.remove('active');
         freeSlot.dataset.filled = '';
       }
       
       // Automatically select the drawn card after placing free space card
       if (drawnCardValue) {
         drawnCard.classList.add('active');
       }
      
      // Check if the game is still winnable after this placement
      let stillPossible = false;
      const filledValues = placedCards.filter(c => c !== null).map(getCardValue);
      const combos = getAllValueCombos(filledValues);
      stillPossible = combos.some(arr => arr.every((val, idx) => idx === 0 || arr[idx] >= arr[idx - 1]));
      if (!stillPossible) {
  message.innerHTML = `<span style="color:red;">Game Over</span> <span style="color:white;">|</span> <span style="color:limegreen;">Final Score:</span> <span style="color:white;">${totalPoints}</span>`;
        const allSlots = document.querySelectorAll('.slot');
        allSlots.forEach(slot => { slot.style.pointerEvents = 'none'; });
        window.numericalGameOver = true;
        return;
      }
      checkForWin();
    }
  });
});

// Initialize free space on page load if button is active
document.addEventListener('DOMContentLoaded', () => {
  if (freeSpaceButton && freeSpaceButton.classList.contains('active')) {
    // Create the free space slot
    const cardArea = document.getElementById('card-area');
    if (cardArea) {
      const freeSlot = document.createElement('div');
      freeSlot.id = 'free-space-slot';
      freeSlot.className = 'free-slot';
      freeSlot.innerHTML = '<span class="slot-number">FREE</span>';
      cardArea.appendChild(freeSlot);
      
      // Add click handler for drawn card to toggle selection
      drawnCard.addEventListener('click', () => {
        if (freeSpaceCard && drawnCardValue) {
          // Toggle selection between drawn card and free space card
          if (freeSlot.classList.contains('active')) {
            // Switch selection to drawn card
            freeSlot.classList.remove('active');
            drawnCard.classList.add('active');
          } else {
            // Switch selection to free space card
            drawnCard.classList.remove('active');
            freeSlot.classList.add('active');
          }
        }
      });
      
      // Add click handler for free space slot
      freeSlot.addEventListener('click', () => {
        if (drawnCardValue && !freeSlot.dataset.filled) {
          // Place the drawn card in free space
          freeSlot.innerHTML = '';
          const img = document.createElement('img');
          img.src = `cards/${drawnCardValue}.png`;
          img.alt = drawnCardValue;
          freeSlot.appendChild(img);
          freeSlot.classList.add('filled');
          freeSpaceCard = drawnCardValue;
          freeSlot.dataset.filled = "true";
          drawnCard.src = 'cards/back.png';
          drawnCard.alt = 'Card Back';
          drawnCardValue = null;
          
          // Remove active class from drawn card and add to free space
          drawnCard.classList.remove('active');
          freeSlot.classList.add('active');
          
          // Draw a new card after placing in free space
          const maxCards = freeSpaceButton && freeSpaceButton.classList.contains('active') ? 6 : 5;
          if (!window.numericalGameOver && drawCount < maxCards) {
            setTimeout(() => {
              drawNewCard();
            }, 200);
          }
        } else if (freeSpaceCard && !drawnCardValue) {
          // Pick up card from free space
          drawnCardValue = freeSpaceCard;
          drawnCard.src = `cards/${freeSpaceCard}.png`;
          drawnCard.alt = freeSpaceCard;
          freeSpaceCard = null;
          freeSlot.innerHTML = '<span class="slot-number">FREE</span>';
          freeSlot.classList.remove('filled');
          freeSlot.dataset.filled = '';
          
          // Remove active class from free space and add to drawn card
          freeSlot.classList.remove('active');
          drawnCard.classList.add('active');
        } else if (freeSpaceCard && !drawnCardValue && !freeSlot.classList.contains('active')) {
          // If free space has a card and no drawn card, and free space is not active, make it active
          freeSlot.classList.add('active');
        } else if (freeSpaceCard && drawnCardValue) {
          // Toggle selection between drawn card and free space card
          if (drawnCard.classList.contains('active')) {
            // Switch selection to free space card
            drawnCard.classList.remove('active');
            freeSlot.classList.add('active');
          } else {
            // Switch selection to drawn card
            freeSlot.classList.remove('active');
            drawnCard.classList.add('active');
          }
        }
      });
    }
  }
});