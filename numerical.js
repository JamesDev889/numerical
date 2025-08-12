// Numerical js

// The deck of cards, one for each suit and rank, plus jokers
const deck = [
  // Hearts
  '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H', '10H', 'JH', 'QH', 'KH', 'AH',
  // Diamonds
  '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D', '10D', 'JD', 'QD', 'KD', 'AD',
  // Clubs
  '2C', '3C', '4C', '5C', '6C', '7C', '8C', '9C', '10C', 'JC', 'QC', 'KC', 'AC',
  // Spades
  '2S', '3S', '4S', '5S', '6S', '7S', '8S', '9S', '10S', 'JS', 'QS', 'KS', 'AS',
  // Jokers
  'JB', 'JR'
];

/**
 * Shuffles an array in-place using the Fisher-Yates algorithm.
 * @param {any[]} array
/**
 * Shuffle an array using the Fisher-Yates algorithm.
 * @param {Array} array - The array to shuffle
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/**
 * Refill the deck to a full 54-card set (52 regular + 2 jokers) and shuffle it.
 * Called on first load, New Game, and after each successful round.
 */
function refillAndShuffleDeck() {
  deck.length = 0;
  deck.push(
    // Hearts
    '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H', '10H', 'JH', 'QH', 'KH', 'AH',
    // Diamonds
    '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D', '10D', 'JD', 'QD', 'KD', 'AD',
    // Clubs
    '2C', '3C', '4C', '5C', '6C', '7C', '8C', '9C', '10C', 'JC', 'QC', 'KC', 'AC',
    // Spades
    '2S', '3S', '4S', '5S', '6S', '7S', '8S', '9S', '10S', 'JS', 'QS', 'KS', 'AS',
    // Jokers
    'JB', 'JR'
  );
  shuffleArray(deck);
}

/**
 * Refill the deck to a full 54-card set (52 regular + 2 jokers) excluding the free space card, and shuffle it.
 * Called after each successful round when free space is enabled.
 */
function refillAndShuffleDeckExcludingFreeSpace() {
  deck.length = 0;
  deck.push(
    // Hearts
    '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H', '10H', 'JH', 'QH', 'KH', 'AH',
    // Diamonds
    '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D', '10D', 'JD', 'QD', 'KD', 'AD',
    // Clubs
    '2C', '3C', '4C', '5C', '6C', '7C', '8C', '9C', '10C', 'JC', 'QC', 'KC', 'AC',
    // Spades
    '2S', '3S', '4S', '5S', '6S', '7S', '8S', '9S', '10S', 'JS', 'QS', 'KS', 'AS',
    // Jokers
    'JB', 'JR'
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

    // Reset placed cards
    placedCards = [null, null, null, null, null];
    freeSpaceCard = null;

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
let totalPoints = 0; // Running total of points (streaks)
let highScore = 0; // In-memory high score that resets on page reload

// Initialize high score display on load
if (highScoreEl) {
  highScoreEl.innerHTML = `<span style=\"color:#4a8ff0;\">High Score:</span> <span style=\"color:white;\">${highScore}</span>`;
}


/**
 * Converts a card string (e.g., 'AH', '10D') to its numeric value.
 * Returns an array for Ace ([1, 14]) to support both low and high.
 * Jokers return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] to represent any value.
 * @param {string} card
 * @returns {number|number[]}
 */
function getCardValue(card) {
  // Check if it's a joker first
  if (card === 'JB' || card === 'JR') {
    // Jokers can be any value from 1 to 14
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  }
  
  // Extract rank from card string (e.g., '2H' -> '2', '10H' -> '10', 'JH' -> 'J')
  let rank;
  if (card.startsWith('10')) {
    rank = '10';
  } else {
    rank = card.charAt(0);
  }
  
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
 * Animates card images from their current positions back to the deck (drawn card position).
 * Creates cloned images that fly across the screen with scaling and opacity effects.
 * Used when starting a new game or after winning a round to visually return cards to deck.
 * 
 * @param {HTMLElement[]} slotsEls - Array of slot elements containing card images to animate
 * @returns {Promise<void>} - Resolves when all card animations complete and clones are removed
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
  // Jokers can always be placed anywhere
  if (card === 'JB' || card === 'JR') {
    return true;
  }
  
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
  
  // If free space is empty, card can always be placed there
  if (!freeSpaceCard) {
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
  
  return false;
}

/**
 * Checks if a card can be placed in any regular slot (not including free space).
 */
function canPlaceInRegularSlots(card) {
  // Jokers can always be placed in any regular slot
  if (card === 'JB' || card === 'JR') {
    return true;
  }
  
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

        // Create flying clones from each filled slot image and free space card
        const flyPromises = [];
        
        // Animate regular slot cards
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
        
        // Animate free space card if it exists
        const freeSpaceSlot = document.getElementById('free-space-slot');
        if (freeSpaceSlot && freeSpaceSlot.classList.contains('filled')) {
          const img = freeSpaceSlot.querySelector('img');
          if (img) {
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
          }
        }

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
  
  // Always refill and shuffle the full deck, including any card that was in free space
  refillAndShuffleDeck();
  freeSpaceCard = null;
  
  placedCards = [null, null, null, null, null];

  drawnCardValue = null;
  // Reset slots to empty numbered rectangles
  const slots = document.querySelectorAll('.slot');
  slots.forEach((slot, i) => {
    slot.classList.remove('filled');
    slot.dataset.filled = '';
    slot.style.pointerEvents = '';
    slot.innerHTML = `<span class="slot-number">${i + 1}</span>`;
  });
  
  // Reset free space slot to show "FREE"
  const freeSpaceSlot = document.getElementById('free-space-slot');
  if (freeSpaceSlot) {
    freeSpaceSlot.innerHTML = '<span class="slot-number">FREE</span>';
    freeSpaceSlot.classList.remove('filled');
    freeSpaceSlot.dataset.filled = '';
  }
  // Reset drawn card
  drawnCard.src = 'cards/back.png';
  drawnCard.alt = 'Card Back';
  // Enable draw button
  // drawButton.disabled = false;
  if (typeof afterReset === 'function') afterReset();
}


/**
 * Draws a new card from the deck, updates the UI, and checks if the game can continue.
 * If the game cannot continue with the current cards, it ends the game.
 */
function drawNewCard() {
  if (deck.length === 0) {
    alert("No more cards!");
    return;
  }
  
  const selectedCard = deck.pop();
  drawnCard.src = `cards/${selectedCard}.png`;
  drawnCard.alt = selectedCard;
  drawnCardValue = selectedCard;
  
  // Do not toggle selection; drawn card is always the active one by logic
  
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
}


/**
 * Handles slot clicks: places the drawn card in the clicked slot, updates state, and checks for win.
 */
const slots = document.querySelectorAll('.slot');
slots.forEach((slot, index) => {
  slot.addEventListener('click', () => {
    // Place drawn card if slot is empty (no selection toggling)
    const canPlaceDrawnCard = drawnCardValue && !slot.dataset.filled;
    
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
      slot.style.pointerEvents = 'none';
      
      // Check if the game is still winnable after this placement
      let stillPossible = false;
      const filledValues = placedCards.filter(c => c !== null).map(getCardValue);
      
      // If there are jokers, the game is always winnable
      const hasJokers = placedCards.some(card => card === 'JB' || card === 'JR');
      if (hasJokers) {
        stillPossible = true;
      } else {
        const combos = getAllValueCombos(filledValues);
        stillPossible = combos.some(arr => arr.every((val, idx) => idx === 0 || arr[idx] >= arr[idx - 1]));
      }
      
      if (!stillPossible) {
        message.innerHTML = `<span style="color:red;">Game Over</span> <span style="color:white;">|</span> <span style="color:limegreen;">Final Score:</span> <span style="color:white;">${totalPoints}</span>`;
        const allSlots = document.querySelectorAll('.slot');
        allSlots.forEach(slot => { slot.style.pointerEvents = 'none'; });
        window.numericalGameOver = true;
        return;
      }
      checkForWin();
      // Only draw a new card if the game is not over and no win occurred
      if (!window.numericalGameOver && !placedCards.every(card => card !== null)) {
        setTimeout(() => {
          drawNewCard();
        }, 200); // 200ms delay after placing a card
      }
    }
  });
});

// Initialize free space on page load (always present)
document.addEventListener('DOMContentLoaded', () => {
  // Create the free space slot
  const cardArea = document.getElementById('card-area');
  if (cardArea && !document.getElementById('free-space-slot')) {
    const freeSlot = document.createElement('div');
    freeSlot.id = 'free-space-slot';
    freeSlot.className = 'free-slot';
    freeSlot.innerHTML = '<span class="slot-number">FREE</span>';
    cardArea.appendChild(freeSlot);
      
      // No drawn-card toggle logic needed when free space is always present
      
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
          
          // No active toggling needed
          
          // Draw a new card after placing in free space
          if (!window.numericalGameOver) {
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
          // No active toggling needed
        }
      });
  }
  
  // Add touch feedback for buttons on touch devices
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    const buttons = [newGameButton];
    
    buttons.forEach(button => {
      if (button) {
        button.addEventListener('touchstart', () => {
          button.classList.add('touch-feedback');
          setTimeout(() => {
            button.classList.remove('touch-feedback');
          }, 200);
        });
      }
    });
    
    /**
     * Centers the horizontal scroll position for touch devices in landscape mode.
     * This ensures the slots area is centered on the screen.
     */
    function centerHorizontalScroll() {
      if (window.innerWidth > window.innerHeight) { // Landscape mode
        const slotsArea = document.getElementById('slots-area');
        if (slotsArea) {
          const containerWidth = window.innerWidth;
          const slotsWidth = slotsArea.scrollWidth;
          const centerOffset = (slotsWidth - containerWidth) / 2;
          
          if (centerOffset > 0) {
            window.scrollTo({
              left: centerOffset,
              behavior: 'smooth'
            });
          }
        }
      }
    }
    
    // Center scroll on page load
    centerHorizontalScroll();
    
    // Center scroll on orientation change
    window.addEventListener('orientationchange', () => {
      setTimeout(centerHorizontalScroll, 100); // Small delay to ensure layout is updated
    });
    
    // Center scroll on window resize (for devices that don't trigger orientationchange)
    window.addEventListener('resize', () => {
      setTimeout(centerHorizontalScroll, 100);
    });
  }
});