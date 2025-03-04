document.addEventListener('DOMContentLoaded', function() {
    // Word list to search for
    const words = ['LOVE', 'BIRTHDAY', 'SURPRISE', 'CAKE', 'PARTY', 'HAPPY', 'SMILE'];

    // Grid size (we're creating a 10x10 grid)
    const gridSize = 10;
    let selectedCells = [];  // Store the selected cells during the mouse drag
    let foundWords = [];  // Store the found words
    let wordPositions = {};  // Store the positions of each word in the grid

    function startGame() {
        // Initialize an empty grid
        let grid = createEmptyGrid(gridSize);

        // Place words in the grid
        placeWordsInGrid(grid, words);

        // Fill remaining empty spaces with random letters
        fillRandomLetters(grid);

        // Display the grid
        displayGrid(grid);

        // Show the word list
        displayWordList(words);
    }

    function createEmptyGrid(size) {
        let grid = [];
        for (let i = 0; i < size; i++) {
            grid[i] = [];
            for (let j = 0; j < size; j++) {
                grid[i][j] = '';
            }
        }
        return grid;
    }

    function placeWordsInGrid(grid, words) {
        words.forEach(word => {
            let placed = false;
            while (!placed) {
                // Randomly choose a direction (horizontal or vertical)
                let direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
                let row = Math.floor(Math.random() * gridSize);
                let col = Math.floor(Math.random() * gridSize);

                if (canPlaceWord(grid, word, row, col, direction)) {
                    placeWord(grid, word, row, col, direction);
                    // Store word positions for highlighting later
                    wordPositions[word] = { word, direction, row, col };
                    placed = true;
                }
            }
        });
    }

    function canPlaceWord(grid, word, row, col, direction) {
        // Check if the word can fit in the grid based on the direction
        if (direction === 'horizontal') {
            if (col + word.length > gridSize) return false;
            for (let i = 0; i < word.length; i++) {
                if (grid[row][col + i] !== '') return false;
            }
        } else if (direction === 'vertical') {
            if (row + word.length > gridSize) return false;
            for (let i = 0; i < word.length; i++) {
                if (grid[row + i][col] !== '') return false;
            }
        }
        return true;
    }

    function placeWord(grid, word, row, col, direction) {
        // Place the word in the grid
        if (direction === 'horizontal') {
            for (let i = 0; i < word.length; i++) {
                grid[row][col + i] = word[i];
            }
        } else if (direction === 'vertical') {
            for (let i = 0; i < word.length; i++) {
                grid[row + i][col] = word[i];
            }
        }
    }

    function fillRandomLetters(grid) {
        // Fill empty spots in the grid with random letters
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if (grid[i][j] === '') {
                    // Randomly pick a letter from the alphabet
                    grid[i][j] = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                }
            }
        }
    }

    function displayGrid(grid) {
        let gridContainer = document.getElementById('grid-container');
        gridContainer.innerHTML = '';  // Clear the grid

        // Create div elements for each grid cell
        grid.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                let cellDiv = document.createElement('div');
                cellDiv.textContent = cell || '';
                cellDiv.setAttribute('data-row', rowIndex);
                cellDiv.setAttribute('data-col', colIndex);
                cellDiv.classList.add('grid-cell');
                cellDiv.addEventListener('mousedown', () => startSelection(cellDiv));
                cellDiv.addEventListener('mouseover', () => dragSelection(cellDiv));
                cellDiv.addEventListener('mouseup', () => endSelection(cellDiv));
                gridContainer.appendChild(cellDiv);
            });
        });

        // Highlight cells of found words on the grid
        highlightFoundWords();
    }

    function displayWordList(words) {
        let wordListContainer = document.getElementById('word-list');
        wordListContainer.innerHTML = '';  // Clear the word list

        // Add each word to the list
        words.forEach(word => {
            let li = document.createElement('li');
            li.textContent = word;
            wordListContainer.appendChild(li);
        });
    }

    function highlightFoundWords() {
        // Highlight all the cells of found words
        for (let word in wordPositions) {
            if (foundWords.includes(word)) {
                let { word: currentWord, direction, row, col } = wordPositions[word];
                for (let i = 0; i < currentWord.length; i++) {
                    let cellDiv;
                    if (direction === 'horizontal') {
                        cellDiv = document.querySelector(
                            `[data-row="${row}"][data-col="${col + i}"]`
                        );
                    } else if (direction === 'vertical') {
                        cellDiv = document.querySelector(
                            `[data-row="${row + i}"][data-col="${col}"]`
                        );
                    }
                    if (cellDiv) {
                        cellDiv.classList.add('found');
                    }
                }
            }
        }
    }

    function startSelection(cellDiv) {
        selectedCells = [];  // Clear previous selection
        selectedCells.push(cellDiv);
        cellDiv.classList.add('selected');
    }

    function dragSelection(cellDiv) {
        // Allow mouse dragging for selection
        if (selectedCells.length > 0) {
            let lastSelected = selectedCells[selectedCells.length - 1];
            let rowDiff = Math.abs(lastSelected.getAttribute('data-row') - cellDiv.getAttribute('data-row'));
            let colDiff = Math.abs(lastSelected.getAttribute('data-col') - cellDiv.getAttribute('data-col'));

            // Only add cells in the same row or column
            if (rowDiff <= 1 && colDiff <= 1) {
                if (!selectedCells.includes(cellDiv)) {
                    selectedCells.push(cellDiv);
                    cellDiv.classList.add('selected');
                }
            }
        }
    }

    function endSelection(cellDiv) {
        if (selectedCells.length > 1) {
            let word = getWordFromSelectedCells(selectedCells);
            checkWord(word);
        }
        selectedCells = [];  // Reset selection after a word is completed
        clearSelection();  // Clear highlights
    }

    function getWordFromSelectedCells(selectedCells) {
        // Get the word by reading the selected cells
        let word = '';
        selectedCells.forEach(cell => {
            word += cell.textContent;
        });
        return word;
    }

    function checkWord(word) {
        // Check if the selected word is in the word list
        if (words.includes(word) && !foundWords.includes(word)) {
            foundWords.push(word);
            markWordFound(word);
        }
    }

    function markWordFound(word) {
        // Mark the word as found in the grid and the word list
        let gridCells = document.querySelectorAll('.grid-cell');
        gridCells.forEach(cell => {
            if (cell.textContent === word) {
                cell.classList.add('found');
            }
        });

        // Update the word list to show that the word has been found
        let wordList = document.getElementById('word-list');
        let wordItems = wordList.getElementsByTagName('li');
        for (let i = 0; i < wordItems.length; i++) {
            if (wordItems[i].textContent === word) {
                wordItems[i].style.textDecoration = 'line-through';
            }
        }

        // Highlight the word's cells in the grid
        highlightFoundWords();
    }

    function clearSelection() {
        let gridCells = document.querySelectorAll('.grid-cell');
        gridCells.forEach(cell => {
            cell.classList.remove('selected');
        });
    }

    // Start the game when the page loads
    startGame();
});

    
