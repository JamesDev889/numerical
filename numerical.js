// Numerical js

// Variables for slots and cards
const drawSlot = document.getElementById('drawSlot');
const slots = ['freeSlot', 'slot1', 'slot2', 'slot3', 'slot4', 'slot5'].map(id => document.getElementById(id));
const fullDeck = ['2C','3C','4C','5C','6C','7C','8C','9C','10C','JC','QC','KC','AC','2D','3D','4D','5D','6D','7D','8D','9D','10D','JD','QD','KD','AD','2H','3H','4H','5H','6H','7H','8H','9H','10H','JH','QH','KH','AH','2S','3S','4S','5S','6S','7S','8S','9S','10S','JS','QS','KS','AS','JB','JR'];
let deck = ['2C','3C','4C','5C','6C','7C','8C','9C','10C','JC','QC','KC','AC','2D','3D','4D','5D','6D','7D','8D','9D','10D','JD','QD','KD','AD','2H','3H','4H','5H','6H','7H','8H','9H','10H','JH','QH','KH','AH','2S','3S','4S','5S','6S','7S','8S','9S','10S','JS','QS','KS','AS','JB','JR'];
let highScore = 0;
let score = 0;


// when the user clicks new game current streak is set to 0, the deck is shuffled,
// a card is drawn, and slots are reset.
document.getElementById('newGameBtn').onclick = () => {
    startNewGame();
};

// when the user clicks endless button, toggle the endless mode
document.getElementById('endlessBtn').onclick = () => {
    // Toggle the button state
    document.getElementById('endlessBtn').classList.toggle('toggled');
};

// Game starts with back card - no automatic start

function startNewGame() {
    //resets score
    score = 0;
    document.querySelector('.score').innerHTML = `<span class="score-label">Score:</span> <span class="score-value">${score}</span>`;
    shuffleCards();
    drawCard();
    //sets all images in slots to original html text
    slots.forEach(slot => slot.innerHTML = slot.id === 'freeSlot' ? 'Free' : slot.id.slice(-1));
    // Re-enable slot clicks for new game
    slots.forEach(slot => slot.style.pointerEvents = 'auto');
    // Reset score display to normal
    document.querySelector('.score').innerHTML = `<span class="score-label">Score:</span> <span class="score-value">${score}</span>`;
}

// Fisher-Yates shuffle that refills the deck first
function shuffleCards() {
    deck = [...fullDeck];
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function handleSlotClick() {
    //if the drawn card is not a back card and the clicked slot contains its original html content, then the 
    // drawn card will move to that slot and a new card will be drawn
    if (!drawSlot.querySelector('img').src.includes('back.png') && (this.innerHTML === this.id.slice(-1) || this.innerHTML === 'Free')) {
        this.innerHTML = drawSlot.innerHTML;
        
        // Checks for loss after placing the card
        if (checkPlaceLoss()) {
            return; // Game is over, stop execution
        }
        
        // Check for win if all slots 1-5 are filled
        if (slots[1].innerHTML !== '1' && 
            slots[2].innerHTML !== '2' && 
            slots[3].innerHTML !== '3' && 
            slots[4].innerHTML !== '4' && 
            slots[5].innerHTML !== '5') {
            userWins();
        } else {
            // Draw a new card and check for draw loss
            drawCard();
            if (checkDrawLoss()) {
                return; // Game is over, stop execution
            }
        }
    }
}

// when the user clicks a slot, the drawn card moves to that slot
slots.forEach(slot => slot.onclick = handleSlotClick);

// draws the last card in the array and replaced the html content of the slot with the card image
function drawCard() {
    drawSlot.innerHTML = `<img src="cards/${deck.pop()}.png" style="width:100%;height:100%;object-fit:cover;" />`;
}

// Helper function to check if cards are in order (without showing back card)
function checkOrder() {
    let previousValue = 0;
    
    for (let i = 1; i <= 5; i++) {
        // Skip empty slots (slots that still show their original number)
        if (slots[i].innerHTML === i.toString()) {
            continue;
        }
        
        const card = slots[i].querySelector('img').src.split('/').pop().replace('.png', '');
        let currentValue;

        // if the card is a joker then skip the comparison because a joker can be worth any value
        if (card.startsWith('JB') || card.startsWith('JR')) {
            continue;
        // if the previous value is less than or equal to 1 then the ace is worth 1, otherwise the ace is worth 14
        } else if (card.startsWith('A')) {
            currentValue = (previousValue <= 1) ? 1 : 14;
        // otherwise J = 11, Q = 12, K = 13, and 2-10 are converted from string to int so 
        // the computer reads them as numbers for comparison
        } else {
            currentValue = card.startsWith('J') ? 11 : 
                          card.startsWith('Q') ? 12 : 
                          card.startsWith('K') ? 13 : 
                          parseInt(card);
        }
        
        // if currentValue is less than previousValue than the cards must not be in order
        if (currentValue < previousValue) {
            return false; // Order is broken
        }
        previousValue = currentValue;
    }
    
    return true; // Order is maintained
}

function checkPlaceLoss() {
    // Check if order is maintained
    if (!checkOrder()) {
        // Check if endless mode is toggled
        // Normal mode: show game over
        drawSlot.innerHTML = `<img src="cards/back.png" style="width:100%;height:100%;object-fit:cover;" />`;
        showGameOver();
        if (document.getElementById('endlessBtn').classList.contains('toggled')) {
            // Endless mode: start new game instead of game over
            setTimeout(() => {
                startNewGame();
            }, 2000);
            return true; // Game is over (but new game started)
        } else {
            
            return true; // Game is over
        }
    }
    
    return false; // Game continues
}

function checkDrawLoss() {
    const drawnCard = drawSlot.querySelector('img').src.split('/').pop().replace('.png', '');
    
    // If free slot is available or drawn card is a joker, no draw loss
    if (slots[0].innerHTML === 'Free' || drawnCard.startsWith('JB') || drawnCard.startsWith('JR')) {
        return false;
    }
    
    // Try placing the card in each empty slot
    for (let slotIndex = 1; slotIndex <= 5; slotIndex++) {
        if (slots[slotIndex].innerHTML !== slotIndex.toString()) {
            continue; // Skip filled slots
        }
        
        // Temporarily place the card
        const originalContent = slots[slotIndex].innerHTML;
        slots[slotIndex].innerHTML = drawSlot.innerHTML;
        
        // Check if order is maintained
        if (checkOrder()) {
            // Order is good, restore and return success
            slots[slotIndex].innerHTML = originalContent;
            return false; // No draw loss
        }
        
        // Order is broken, restore and try next slot
        slots[slotIndex].innerHTML = originalContent;
    }
    slots.forEach(slot => slot.style.pointerEvents = 'none');
    showGameOver();
    // Can't place anywhere - game over
    // Check if endless mode is toggled
    if (document.getElementById('endlessBtn').classList.contains('toggled')) {
        // Endless mode: delay then start new game so user can see the card they lost to
        setTimeout(() => {
            startNewGame();
        }, 2000); // 2 second delay
        return true; // Game is over (but new game will start after delay)
    } else {
        
        return true; // Game is over
    }
}

function showGameOver() {
    document.querySelector('.score').innerHTML = `<span class="game-over-text">Game Over</span> <span class="score-separator">|</span> <span class="final-score-label">Final Score:</span> <span class="score-value">${score}</span>`;
}

//checks if the cards are in numerical order by comparing current card to previous card until all cards have been compared
function userWins(){

    //increases score by 1 if all 5 cards are in numerical order
    score++;
    document.querySelector('.score').innerHTML = `<span class="score-label">Score:</span> <span class="score-value">${score}</span>`;
    //sets high score equal to score if score is greater than high score
    if (score > highScore) {
        highScore = score;
        document.getElementById('high-score').innerHTML = `<span class="high-score-label">High Score:</span> <span class="high-score-value">${highScore}</span>`;
    }
    
    // Animate winning cards in a wave
    animateWinningCards();
    
    // Reset after animation completes
    setTimeout(() => {
        slots.forEach(slot => slot.innerHTML = slot.id === 'freeSlot' ? 'Free' : slot.id.slice(-1));
        shuffleCards();
        drawCard();
    }, 1200 + 5 * 200);
}

function animateWinningCards() {
    // Show back card in draw slot during animation
    drawSlot.innerHTML = `<img src="cards/back.png" style="width:100%;height:100%;object-fit:cover;" />`;
    
    // Simple wave animation for slots 1-5
    for (let i = 1; i <= 5; i++) {
        const slot = slots[i];
        
        // Clear any existing animation first
        slot.style.animation = 'none';
        
        // Force a reflow to ensure the animation reset takes effect
        slot.offsetHeight;
        
        // Add wave animation with delay to the entire slot
        slot.style.animation = `wave 1.2s ease-in-out ${(i-1) * 0.2}s`;
    }
}
