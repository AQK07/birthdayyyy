document.addEventListener("DOMContentLoaded", () => {
  const gridSize = 10;
  const words = [
    "TREASURE", "BEACH", "SAND", "SUN", "WAVES",
    "SHELL", "OCEAN", "PALM", "SUNSET", "TROPICAL"
  ];
  const grid = document.getElementById("grid");
  const wordList = document.getElementById("word-list");
  const startupScreen = document.getElementById("startup-screen");
  const wordSearchContainer = document.getElementById("word-search-container");
  const startButton = document.getElementById("start-button");

  let selectedCells = []; // Track selected cells
  let foundWords = new Set(); // Track found words
  let foundWordCells = new Map(); // Track cells of found words
  let gridData = []; // Store the letter grid for future reference

  // Start Game button click event
  startButton.addEventListener("click", () => {
    startupScreen.style.display = "none";
    wordSearchContainer.style.display = "block";
    createGrid();
    placeWords();
    fillEmptyCellsWithRandomLetters();
  });

  // Create the grid
  function createGrid() {
    grid.innerHTML = ''; // Clear grid before re-creating
    gridData = Array(gridSize).fill().map(() => Array(gridSize).fill('')); // Initialize empty grid

    for (let i = 0; i < gridSize * gridSize; i++) {
      const cell = document.createElement("div");
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener("mousedown", () => startSelection(cell));
      cell.addEventListener("mouseenter", () => addToSelection(cell));
      cell.addEventListener("mouseup", () => endSelection());
      grid.appendChild(cell);
    }

    // Add a listener to clear the selection if the mouse leaves the grid
    grid.addEventListener("mouseleave", () => {
      selectedCells.forEach(cell => cell.classList.remove("selected"));
      selectedCells = [];
    });
  }

  // Place words in the grid
  function placeWords() {
    words.forEach(word => {
      let placed = false;
      while (!placed) {
        const direction = Math.floor(Math.random() * 2); // 0: horizontal, 1: vertical
        const startRow = Math.floor(Math.random() * gridSize);
        const startCol = Math.floor(Math.random() * gridSize);

        if (canPlaceWord(word, startRow, startCol, direction)) {
          for (let i = 0; i < word.length; i++) {
            let index;
            if (direction === 0) {
              index = startRow * gridSize + (startCol + i);
            } else {
              index = (startRow + i) * gridSize + startCol;
            }

            // Place the word on the grid and update gridData
            grid.children[index].textContent = word[i];
            gridData[startRow + (direction === 1 ? i : 0)][startCol + (direction === 0 ? i : 0)] = word[i];
          }
          placed = true;
        }
      }
    });
  }

  // Check if a word can be placed at the specified position
  function canPlaceWord(word, startRow, startCol, direction) {
    if (direction === 0) { // Horizontal
      if (startCol + word.length > gridSize) return false;
      for (let i = 0; i < word.length; i++) {
        if (gridData[startRow][startCol + i] !== '') return false;
      }
    } else { // Vertical
      if (startRow + word.length > gridSize) return false;
      for (let i = 0; i < word.length; i++) {
        if (gridData[startRow + i][startCol] !== '') return false;
      }
    }
    return true;
  }

  // Fill empty cells with random letters
  function fillEmptyCellsWithRandomLetters() {
    for (let i = 0; i < gridSize * gridSize; i++) {
      const cell = grid.children[i];
      if (!cell.textContent) { // If cell is empty, fill with random letter
        cell.textContent = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // Random letter
      }
    }
  }

  // Start selection
  function startSelection(cell) {
    selectedCells = [cell];
    cell.classList.add("selected");
  }

  // Add to selection
  function addToSelection(cell) {
    if (selectedCells.length > 0 && !selectedCells.includes(cell)) {
      selectedCells.push(cell);
      cell.classList.add("selected");
    }
  }

  // End selection
  function endSelection() {
    const selectedWord = selectedCells.map(cell => cell.textContent).join("");
    checkWord(selectedWord);
    selectedCells.forEach(cell => cell.classList.remove("selected"));
    selectedCells = [];
  }

  // Check if the selected word is valid
  function checkWord(selectedWord) {
    words.forEach(word => {
      if (
        (selectedWord === word) || 
        (selectedWord === word.split("").reverse().join(""))
      ) {
        if (!foundWords.has(word)) {
          foundWords.add(word);
          highlightWord(word, selectedCells);
          updateWordList(word);
          checkCompletion();
        }
      }
    });
  }

  // Highlight the found word in the grid
  function highlightWord(word, selectedCells) {
    selectedCells.forEach(cell => {
      cell.classList.add("highlight");
    });
  }

  // Update the word list
  function updateWordList(word) {
    const wordItem = Array.from(wordList.children).find(li => li.textContent === word);
    if (wordItem) {
      wordItem.classList.add("found");
    }
  }

  // Check if all words have been found
  function checkCompletion() {
    if (foundWords.size === words.length) {
      wordSearchContainer.style.display = "none";
      document.getElementById("completion-screen").style.display = "block";
    }
  }
});
