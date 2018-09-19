// to do: 
// make fresh api call with new game
// make mini result for each q
// update style
// eliminate gameStarted and use curQ = -1 as flag instead?

var timerDisplay = document.querySelector("#timer");
var questionDisplay = document.querySelector("#question");
var answerDisplay = document.querySelector("#answer-choices");
var gameArea = document.querySelector("game-area");
var curQ = -1; // index current question
var questionAnswered = false; 
var gameStarted = false;
var timeRemaining = 30;
var timerID = null;
var results = {
  correct: 0,
  incorrect: 0,
  unanswered: 0
}




function displayNewQA() {
  curQ++;
  if (!gameStarted) {
    gameStarted = true;
    results = {
      correct: 0,
      incorrect: 0,
      unanswered: 0
    }
  }
  if (curQ < quests.length) {
    questionDisplay.textContent = quests[curQ].question;
    questionAnswered = false;
    setAnswerChoices();
    setCountdown();
  }
}

function setAnswerChoices() {
  while (answerDisplay.firstChild) {
    answerDisplay.removeChild(answerDisplay.firstChild);
  }
  for (var i = 0; i < quests[curQ].answers.length; i++) {
    var choice = document.createElement("p");
    choice.classList.add("choice");
    choice.value = i;
    choice.textContent = quests[curQ].answers[i];
    choice.addEventListener("click", (e) => {
      console.log(e.target.value);
      handleAnswer(e.target.value);
    })
    answerDisplay.appendChild(choice);
  }
}

function handleAnswer(answerVal) {
  if (answerVal == quests[curQ].indexCorrect) {
    results.correct++;
  } else {
    results.incorrect++;
  }
  questionAnswered = true;
  if (curQ < quests.length - 1) {
    displayNewQA();
  } else {
    gameOver();
  }
}

function setCountdown() {
  if (timerID) clearInterval(timerID);
  timeRemaining = 30;
  timerDisplay.textContent = timeRemaining;
  timerID = setInterval(tick, 1000);
}

function tick() {
  timeRemaining--;
  timerDisplay.textContent = timeRemaining;
  if (timeRemaining === 0) {
    if (!questionAnswered) results.unanswered++;
    if (curQ === quests.length -1 ) {
      gameOver();
    }
    displayNewQA();
  }
}

function gameOver() {
  if (timerID) clearInterval(timerID);
  curQ = -1;
  gameStarted = false;
  displayResults();
}

function displayResults() {
  timerDisplay.textContent = "Game over!";
  questionDisplay.textContent = "How did you do?";
  while (answerDisplay.firstChild) {
    answerDisplay.removeChild(answerDisplay.firstChild);
  }
  var resultsHTML = "<p class='results'> Correct: " + results.correct +
    "</p><p class='results'> Incorrect: " + results.incorrect +
    "</p><p class='results'> Unanswered: " + results.unanswered +
    "</p>";
  answerDisplay.innerHTML = resultsHTML;
}


document.querySelector("#start-game").addEventListener("click", () => {
  if (!gameStarted) displayNewQA();
});