// My first JavaScript!
// Let's make the button interactive

// Create an array of colors
const colors = ['white', 'red', 'green', 'blue', 'black'];
const colorButton = document.querySelector('#color-button');
const refreshButton = document.querySelector('#refresh-button');
const hideButton = document.querySelector('#hide-button');
const consoleButton = document.querySelector('#console-button');
// Initializes an index variable to cycle through the array of colors
let currentIndex = 0;



// Set the initial background to white
document.body.style.backgroundColor = colors[0];

// Calls the changeColor function when the color button is clicked
colorButton.addEventListener('click', changeColor);
// Calls the startTimer function when the timer button is clicked
refreshButton.addEventListener('click', refreshPage);
// Calls the hideButton function when the hide button is clicked
hideButton.addEventListener('click', hide);
// Calls the consoleButton function when the print console button is clicked
consoleButton.addEventListener('click', logArray);

// Named function to change colors
function changeColor() {
    // Move to the next color
    currentIndex = currentIndex + 1;
    
    // If we've gone past the last color, go back to the first
    if (currentIndex >= colors.length) {
        currentIndex = 0;
    }
    
    // Change the background to the new color
    document.body.style.backgroundColor = colors[currentIndex];
}

// Function to hide/show other buttons
function hide() {
    // Better way to check if buttons are hidden
    if (colorButton.style.display === 'none') {
        // Show buttons
        colorButton.style.display = '';  // Reset to default
        refreshButton.style.display = ''; // Reset to default
        consoleButton.style.display = '';
        hideButton.textContent = 'Hide Buttons';
    } else {
        // Hide buttons
        colorButton.style.display = 'none';
        refreshButton.style.display = 'none';
        consoleButton.style.display = 'none';
        hideButton.textContent = 'Show Buttons';
    }
}

function refreshPage() {
    location.reload();
}

function logArray() {
//logs all colors in array to console
for (let i = 0; i < colors.length; i++) {
    console.log(colors[i]);
}
}