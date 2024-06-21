var rows = 4; // global variables for the rows and columns of the game
var cols = 4;

// array used to store the correct placement of the text in the cells 
var correctOrder = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", ""];

window.onload = function () {
    emptyCell = document.getElementById("3-3"); // getting the empty cell element by it's id

    // here I use a double for loopto iterate through the rows and cols of the table
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            let cell = document.getElementById(row + '-' + col); // every iteration I get the next cell
            cell.addEventListener('click', function () {
                if (checkAdjacent(cell, emptyCell)) {
                    swap(cell, emptyCell);
                    if (checkSolved()) { // checking if it's solved after every move, then changing the color if it is
                        changeColor();
                    }
                    else {
                        document.body.style.backgroundColor = "grey";
                    }
                }
            });
        }
    }

    var resetBtn = document.getElementById("btn-reset");
    resetBtn.addEventListener('click', reset);  // checks if reset btn was clicked then calls the reset function

    var scrambleBtn = document.getElementById("btn-scramble");
    scrambleBtn.addEventListener('click', scramble);
}

// function to check if the cell clicked on and the emptyCell are adjacent
function checkAdjacent(cell, emptyCell) {
    let cellLocation = cell.id.split('-'); // this is an array with the location/cooridantes of the cell
    let emptyCellLocation = emptyCell.id.split('-'); // location array for the empty cell

    // storing the row and col index depending on the cell's id, i used HTML ids from 0-0, 3-3 with first being row and second col
    let cellRow = parseInt(cellLocation[0]);
    let cellCol = parseInt(cellLocation[1]); // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
    let emptyCellRow = parseInt(emptyCellLocation[0]);
    let emptyCellCol = parseInt(emptyCellLocation[1]);

    // calculating the difference between the rows and columns of the cell and the emptyCell
    colDiff = Math.abs(cellCol - emptyCellCol);
    rowDiff = Math.abs(cellRow - emptyCellRow);

    // this checks that the cells are in the same row and the difference between their cols is 1, meaning they're adjacent.
    // also checks that the cells are in the same col and the difference between their rows is 1, meaning they're adjacent.

    let adjacentBool = (cellRow === emptyCellRow && colDiff === 1) ||
        (cellCol === emptyCellCol && rowDiff === 1);
    // the function will return the result of adjacency as a boolean
    return adjacentBool;
}

// function to swap the text of the cell clicked on and the blank cell
function swap(cell, emptyCellElement) {
    // swapping the text of the cell clicked on and the blank cell
    let tempText = cell.innerText;
    cell.innerText = emptyCellElement.innerText;
    emptyCellElement.innerText = tempText;

    // after the swap, the emptyCell becomes the cell we swapped with, this is done so I could keep track of the emptyCell
    emptyCell = cell;
}

// function to check if the game is solved
function checkSolved() {
    let orderToCheck = []; // this is a placeholder array to hold the current values of the board after the user plays each move
    // iterating through the table
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            let cell = document.getElementById(row + '-' + col);
            orderToCheck.push(cell.innerText); // appending the text of the cells to the array
        }
    }
    // now that we have the position of the cells after the user plays
    // compare the order of the current text to the order that I know is correct, ie, 1,2,3,4...
    for (let i = 0; i < correctOrder.length; i++) {
        if (correctOrder[i] !== orderToCheck[i]) return false;
    }
    return true; // if all values cells appear to be in the right spot, return true
}

// function to change the color of the background once the user solves the puzzle
function changeColor() {
    document.body.style.backgroundColor = "lightgreen";
    setTimeout(function () { // I ran into a problem here when I tried to alert the user, the alert would go off first, and the color would only change after the alert was closed
        // to fix this, I added a timeout on the alert to make sure the color change was done first
        alert("Well done, you solved it! Hit the 'Reset' button to replay!");
    }, 13); // I played around with the value of the delay until I got something that almost looks seemless
}

// function to reset the game
function reset() {
    let index = 0;
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            let cell = document.getElementById(row + '-' + col);
            cell.innerText = correctOrder[index]; // changing back the text of each cell to solved position
            index++;
        }
    }
    document.body.style.backgroundColor = "grey"; // changing the color back to grey
    // after the swap, the emptyCell becomes the cell we swapped with, this is done so I could keep track of the emptyCell
    // reseting the emptyCell position back to the bottom right corner
    emptyCell = document.getElementById("3-3");

}


// function will simulate the users clicks to scramble the game
function scramble() {
    for (let i = 0; i < 200; i++) { // loop to do 200 swaps, I chose this number randomly 
        let nearbyCells = calculateNearbyCells(); // this will return an array with the adjacent cells 
        let arrayIndexRandom = Math.floor(Math.random() * nearbyCells.length); // picking random element from list in js https://www.tutorialspoint.com/how-to-select-a-random-element-from-array-in-javascript
        let randomNearbyCell = nearbyCells[arrayIndexRandom];

        swap(randomNearbyCell, emptyCell); // swapping the random nearby cell selected above with the empty set
    }
    document.body.style.backgroundColor = "grey"; // setting the color back to normal, overwriting the color from the changeColor upon win function
}


// function to find the cells that are on top, bottom, left, right of the empty cell
function calculateNearbyCells() {
    let nearbyCells = []; // this will be the placeholder array for the nearby cell
    let emptyCellLocation = emptyCell.id.split('-'); // getting the location of the empty cell

    let emptyCellRow = parseInt(emptyCellLocation[0]); // to make sure that the string id representing the location of the emptyCell I am working with is converted to a number
    let emptyCellCol = parseInt(emptyCellLocation[1]);

    let cellLeft = document.getElementById(emptyCellRow + '-' + (emptyCellCol - 1)); // this will get the cell to the reft of emptyCell (same row, but the previous col = left)
    let cellRight = document.getElementById(emptyCellRow + '-' + (emptyCellCol + 1)); // this will get the cell to the right of emptyCell (same row, but the preceding col = right)
    let cellUp = document.getElementById((emptyCellRow - 1) + '-' + emptyCellCol); // this will get the cell to the top of emptyCell (same col, but the previous row = up)
    let cellDown = document.getElementById((emptyCellRow + 1) + '-' + emptyCellCol); // this will get the cell to the bottom of emptyCell (same col, but the preceding row = down)

    // makes sure that the cell is not null, then appends it to the array, this is because at the edge of the table, there may not be left or right cell
    if (cellLeft !== null)
        nearbyCells.push(cellLeft);
    if (cellRight !== null)
        nearbyCells.push(cellRight);
    if (cellUp !== null)
        nearbyCells.push(cellUp);
    if (cellDown !== null)
        nearbyCells.push(cellDown);

    return nearbyCells; // returning the array of nearbyCells
}


