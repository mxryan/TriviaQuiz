// to do: 
// make fresh api call with new game
// update style
// add questions remaining



var timerDisplay = document.querySelector("#timer");
var questionDisplay = document.querySelector("#question");
var answerDisplay = document.querySelector("#answer-choices");
var gameArea = document.querySelector("game-area");
var breakTimerDisplay = document.querySelector("#break-timer");
var infoDisplay = document.querySelector("#info");
var curQ = -1; // index current question
var questionAnswered = false;
var gameStarted = false;
var timeRemaining = 30;
var breakTimeRemaining = 5;
var timerID = null;
var breakTimerID = null;
var results = {
  correct: 0,
  incorrect: 0,
  unanswered: 0
}


function displayNewQA() {
  console.log("displayNewQA()");
  curQ++;
  breakTimerDisplay.textContent = "Round Active!"
  infoDisplay.textContent = "";
  if (!gameStarted) {
    console.log("displayNewQA() entif !gameStarted");
    gameStarted = true;
    results = {
      correct: 0,
      incorrect: 0,
      unanswered: 0
    };
  }
  if (curQ < quests.length) {
    console.log("displayNewQA() entif curQ < quests.length");
    questionDisplay.innerHTML = quests[curQ].question;
    questionAnswered = false;
    setAnswerChoices();
    setCountdown();
  }
}

function setAnswerChoices() {
  console.log("setAnswerChoices())");
  while (answerDisplay.firstChild) {
    answerDisplay.removeChild(answerDisplay.firstChild);
  }
  for (var i = 0; i < quests[curQ].answers.length; i++) {
    var choice = document.createElement("p");
    choice.classList.add("choice");
    choice.value = i;
    choice.innerHTML = quests[curQ].answers[i];
    choice.addEventListener("click", (e) => {

      handleAnswer(e.target.value);
    })
    answerDisplay.appendChild(choice);
  }
}

function setCountdown() {
  console.log("setCountdown())");
  if (timerID) clearInterval(timerID);
  timeRemaining = 30;
  timerDisplay.textContent = timeRemaining;
  timerID = setInterval(tick, 1000);
}

function handleAnswer(answerVal) {
  console.log("handleAnswer()")
  if (!questionAnswered) {
    console.log("handleAnswer entif !questionAnswered")
    questionAnswered = true;
    if (answerVal == quests[curQ].indexCorrect) {
      results.correct++;
      infoDisplay.textContent = "Correct!!";
    } else {
      results.incorrect++;
      var correctAnswer = quests[curQ].answers[quests[curQ].indexCorrect];
      infoDisplay.textContent = "Wrong!!" + "Correct answer was: " + correctAnswer;
    }
    startBreak();
  }
}

function startBreak() {
  console.log("startBreak()");
  clearInterval(timerID);
  timerID = null;
  breakTimeRemaining = 5;
  breakTimerID = setInterval(breakTick, 1000);
}

function tick() {
  console.log("tick()");
  timeRemaining--;
  timerDisplay.textContent = timeRemaining;
  if (timeRemaining === 0) {
    if (!questionAnswered) results.unanswered++;
    if (curQ === quests.length - 1) {
      gameOver();
    } else {
      startBreak();
    }
  }
}

function breakTick() {
  console.log("breakTick()");
  breakTimeRemaining--;
  breakTimerDisplay.textContent = breakTimeRemaining;
  if (breakTimeRemaining === 0 && curQ === quests.length - 1) {
    clearInterval(breakTimerID);
    gameOver();
    breakTimerDisplay.textContent = "Game Over!"
  } else if (breakTimeRemaining === 0 && curQ < quests.length - 1) {
    
    clearInterval(breakTimerID);
    displayNewQA();
  }
}

function gameOver() {
  console.log("gameOver");
  if (timerID) clearInterval(timerID);
  curQ = -1;
  gameStarted = false;
  displayResults();
}

function displayResults() {
  console.log("displayResults");
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