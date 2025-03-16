// Function to show the riddle
function showRiddle() {
  document.getElementById('description').style.display = 'none';
  document.getElementById('riddle').style.display = 'block';
  document.getElementById('try-again').style.display = 'none'; // Hide try-again screen
}

// Function to check the answer
function checkAnswer(answer) {
  if (answer === 'fire') {
    document.getElementById('riddle').style.display = 'none';
    document.getElementById('item').style.display = 'block';
  } else {
    document.getElementById('riddle').style.display = 'none';
    document.getElementById('try-again').style.display = 'block'; // Show try-again screen
  }
}

// Function to retry the riddle
function retryRiddle() {
  document.getElementById('try-again').style.display = 'none'; // Hide try-again screen
  document.getElementById('riddle').style.display = 'block'; // Show riddle again
}
