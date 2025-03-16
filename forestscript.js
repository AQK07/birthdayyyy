// Function to show the riddle
function showRiddle() {
  document.getElementById('description').style.display = 'none';
  document.getElementById('riddle').style.display = 'block';
}

// Function to check the answer
function checkAnswer(answer) {
  if (answer === 'echo') {
    document.getElementById('riddle').style.display = 'none';
    document.getElementById('item').style.display = 'block';
  } else {
    alert("Oops, that’s not it! Try again.");
  }
}
