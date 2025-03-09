// As we include the script at head element, we need to wait for the DOM to be fully loaded before executing the script.
// This can be done using the DOMContentLoaded event.
document.addEventListener("DOMContentLoaded", () => {
    // select the DOM elements
    const gridDisplay = document.querySelector(".grid");
    const scoreDisplay = document.querySelector("#score");
    const resultDisplay = document.querySelector("#result");
    const resetButton = document.querySelector("#reset-button");
    const width = 4; // width of the grid
    const squares = []; // array to hold the squares
    let score = 0; // initialize score to 0

    // variables to store touch positions
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    // create the playing board
    function createBoard() {
        for (let i = 0; i < width * width; i++){
            const square = document.createElement("div");
            square.innerHTML = score; // initialize the square with 0
            square.classList.add("square");
            gridDisplay.appendChild(square);
            squares.push(square); // push the square to the squares array
        }

        // generate two random numbers
        generate();
        generate();
    }
    createBoard();

    // generate a new number
    function generate() {
        const randomNumber = Math.floor(Math.random() * squares.length);    // generate a random number between 0 and 15 (index of squares array)
        // console.log(randomNumber);
        if(squares[randomNumber].innerHTML == 0) {
            squares[randomNumber].innerHTML = 2; // generate a new number
            // Check if game is over
            checkGameOver();

            // check if the game is won
            checkForWin();

            addColors(); // add colors to the squares
        }
        else generate(); // if the square is not empty, generate again
    }
    
    // move the squares to the right
    function moveRight() {
        for (let i = 0; i < 16; i++) {
            if (i % 4 === 0) {  // check if the index is a multiple of 4, means we are at the first column
                let totalOne = squares[i].innerHTML; // get the value of the square for the first column block
                let totalTwo = squares[i + 1].innerHTML; // get the value of the square for the second column block
                let totalThree = squares[i + 2].innerHTML;
                let totalFour = squares[i + 3].innerHTML;

                // make a row
                let row = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)];
                // console.log(row);

                // move the row to the right
                let filteredRow = row.filter(num => num); // filter out the empty squares
                let missing = 4 - filteredRow.length;
                let zeros = Array(missing).fill(0); // fill the missing squares with 0
                let newRow = zeros.concat(filteredRow); // concatenate the zeros and the filtered row, first the zeros and then the filtered row
                // console.log(newRow);

                // update the squares
                squares[i].innerHTML = newRow[0]; // set the value of the square to the new row
                squares[i + 1].innerHTML = newRow[1];
                squares[i + 2].innerHTML = newRow[2];
                squares[i + 3].innerHTML = newRow[3];
            }
        }
    }

    // move the squares to the left
    function moveLeft() {
        for (let i = 0; i < 16; i++) {
            if (i % 4 === 0) {
                let totalOne = squares[i].innerHTML;
                let totalTwo = squares[i + 1].innerHTML;
                let totalThree = squares[i + 2].innerHTML;
                let totalFour = squares[i + 3].innerHTML;

                let row = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)];

                let filteredRow = row.filter(num => num);
                let missing = 4 - filteredRow.length;
                let zeros = Array(missing).fill(0);
                let newRow = filteredRow.concat(zeros); // concatenate the filtered row and the zeros
                // console.log(newRow);

                // update the squares
                squares[i].innerHTML = newRow[0]; // set the value of the square to the new row, first the filtered row and then the zeros
                squares[i + 1].innerHTML = newRow[1];
                squares[i + 2].innerHTML = newRow[2];
                squares[i + 3].innerHTML = newRow[3];
            }
        }
    }

    // move the squares up
    function moveUp() {
        for (let i = 0; i < 4; i++) {
            let totalOne = squares[i].innerHTML;
            let totalTwo = squares[i + width].innerHTML;
            let totalThree = squares[i + width * 2].innerHTML;
            let totalFour = squares[i + width * 3].innerHTML;

            let column = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)];

            let filteredColumn = column.filter(num => num);
            let missing = 4 - filteredColumn.length;
            let zeros = Array(missing).fill(0);
            let newColumn = filteredColumn.concat(zeros);

            // update the squares
            squares[i].innerHTML = newColumn[0];
            squares[i + width].innerHTML = newColumn[1];
            squares[i + width * 2].innerHTML = newColumn[2];
            squares[i + width * 3].innerHTML = newColumn[3];
        }
    }

    // move the squares down
    function moveDown() {
        for (let i = 0; i < 4; i++) {
            let totalOne = squares[i].innerHTML;
            let totalTwo = squares[i + width].innerHTML;
            let totalThree = squares[i + width * 2].innerHTML;
            let totalFour = squares[i + width * 3].innerHTML;

            let column = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)];

            let filteredColumn = column.filter(num => num);
            let missing = 4 - filteredColumn.length;
            let zeros = Array(missing).fill(0);
            let newColumn = zeros.concat(filteredColumn); // concatenate the zeros and the filtered column

            // update the squares
            squares[i].innerHTML = newColumn[0];
            squares[i + width].innerHTML = newColumn[1];
            squares[i + width * 2].innerHTML = newColumn[2];
            squares[i + width * 3].innerHTML = newColumn[3];
        }
    }

    // combine the rows if they are the same value
    function combineRow() {
        for (let i = 0; i < 15; i++) {
            if (squares[i].innerHTML === squares[i + 1].innerHTML) { // check if the squares are equal
                let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i + 1].innerHTML);
                squares[i].innerHTML = combinedTotal; // set the first square to the combined total
                squares[i + 1].innerHTML = 0; // set the second square to 0
                score += combinedTotal;
                scoreDisplay.innerHTML = score; // update the score display
            }
        }
        // check if the game is over
        checkGameOver();

        // check if the game is won
        checkForWin();
    }

    // combine the columns if they are the same value
    function combineColumn() {
        for (let i = 0; i < 12; i++) {
            if(squares[i].innerHTML === squares[i + width].innerHTML) {
                let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i + width].innerHTML);
                squares[i].innerHTML = combinedTotal;
                squares[i + width].innerHTML = 0;
                score += combinedTotal;
                scoreDisplay.innerHTML = score;
            }
        }
        // check if the game is over
        checkGameOver();

        // check if the game is won
        checkForWin();
    }
    
    // assign the moveRight function to the right arrow key
    function control(e) {
        if (e.key === 'ArrowRight') {
            keyRight();
        }
        else if (e.key === 'ArrowLeft') {
            keyLeft();
        }
        else if (e.key === 'ArrowUp') {
            keyUp();
        }
        else if (e.key === 'ArrowDown') {
            keyDown();
        }
    }

    // assign the control function to the keydown event
    document.addEventListener("keydown", control);

    // move the squares to the right
    function keyRight() {
        moveRight();
        combineRow();
        moveRight();
        generate();
    }

    // move the squares to the left
    function keyLeft() {
        moveLeft();
        combineRow();
        moveLeft();
        generate();
    }

    // move the squares up
    function keyUp() {
        moveUp();
        combineColumn();
        moveUp();
        generate();
    }

    // move the squares down
    function keyDown() {
        moveDown();
        combineColumn();
        moveDown();
        generate();
    }

    // check for the number 2048 in the squares for win
    function checkForWin() {
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].innerHTML == 2048) {
                resultDisplay.innerHTML = "You Win!";
                document.removeEventListener("keydown", control);
            }
        }
    }

    // check for game over, if there are no zeros left in the squares
    function checkGameOver() {
        let zeros = 0;
        // Count empty squares
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].innerHTML == 0) {
                zeros++;
            }
        }
        // If no empty squares left, game is over
        if (zeros === 0) {
            resultDisplay.innerHTML = "Game Over! Try Again!";
            document.removeEventListener("keydown", control);
            // Show the reset button by adding the 'show' class
            resetButton.classList.add('show');
        }
    }

    // add colors to the squares
    function addColors() {
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].innerHTML == 0) {
                squares[i].style.backgroundColor = "#AFA192"; // set the background color to light gray for empty squares
            }
            else if (squares[i].innerHTML == 2) {
                squares[i].style.backgroundColor = "#eee4da";
            }
            else if (squares[i].innerHTML == 4) {
                squares[i].style.backgroundColor = "#ede0c8";
            }
            else if (squares[i].innerHTML == 8) {
                squares[i].style.backgroundColor = "#f2b179";
            }
            else if (squares[i].innerHTML == 16) {
                squares[i].style.backgroundColor = "#ffcea4";
            }
            else if (squares[i].innerHTML == 32) {
                squares[i].style.backgroundColor = "#e8c064";
            }
            else if (squares[i].innerHTML == 64) {
                squares[i].style.backgroundColor = "#ffab6e";
            }
            else if (squares[i].innerHTML == 128) {
                squares[i].style.backgroundColor = "#fd9982";
            }
            else if (squares[i].innerHTML == 256) {
                squares[i].style.backgroundColor = "#ead79c";
            }
            else if (squares[i].innerHTML == 512) {
                squares[i].style.backgroundColor = "#76daff";
            }
            else if (squares[i].innerHTML == 1024) {
                squares[i].style.backgroundColor = "#beeaa5";
            }
            else if (squares[i].innerHTML == 2048) {
                squares[i].style.backgroundColor = "#d7d4f0";
            }
        }
    }
    
    // For mobile swipe functionality
    // Add touch event listeners for swipe functionality
    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchmove', handleTouchMove, false);
    document.addEventListener('touchend', handleTouchEnd, false);

    // Handle touch start event
    function handleTouchStart(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }

    // Handle touch move event
    function handleTouchMove(e) {
        touchEndX = e.touches[0].clientX;
        touchEndY = e.touches[0].clientY;

        // Prevent default behavior to stop page scrolling
        e.preventDefault();
    }

    // Handle touch end event
    function handleTouchEnd() {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        // Determine the direction of the swipe
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 0) {
                keyRight(); // swipe right
            } else {
                keyLeft(); // swipe left
            }
        } else {
            if (deltaY > 0) {
                keyDown(); // swipe down
            } else {
                keyUp(); // swipe up
            }
        }
    }

    // Function to reset the game
    function resetGame() {
        // Clear the grid
        squares.forEach(square => square.innerHTML = 0);
        // Reset the score
        score = 0;
        scoreDisplay.innerHTML = score;
        // Clear the result display
        resultDisplay.innerHTML = "";
        // Generate two new numbers
        generate();
        generate();

        // Hide the reset button by removing the 'show' class
        resetButton.classList.remove('show');

        // Reset the initial result display message
        resultDisplay.innerHTML = "Join the numbers and get to the <b>2048</b> tile!";
        // Re-enable the keydown event listener
        document.addEventListener("keydown", control);
        

        addColors();
    }

    // Reset the game
    resetButton.addEventListener("click", resetGame);
})