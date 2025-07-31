// My first JavaScript!
// Let's make the button interactive

// Create an array of colors
const colors = ['white', 'red', 'green', 'blue'];
// Initializes an index variable to cycle through the array of colors
let currentIndex = 0;

// Set the initial background to white
document.body.style.backgroundColor = colors[0];

// Calls a function when the first button on the page is clicked (no button variable!)
document.querySelector('button').addEventListener('click', function() {
    // Move to the next color
    currentIndex = currentIndex + 1;
    
    // If we've gone past the last color, go back to the first
    if (currentIndex >= colors.length) {
        currentIndex = 0;
    }
    
    // Change the background to the new color
    document.body.style.backgroundColor = colors[currentIndex];
});