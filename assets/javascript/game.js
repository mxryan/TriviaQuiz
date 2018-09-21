//to do: hide start button when game starts
var newGameBtn = document.querySelector("#start-game");
var timerDisplay = document.querySelector("#timer");
var questionDisplay = document.querySelector("#question");
var answerDisplay = document.querySelector("#answer-choices");
var gameArea = document.querySelector("game-area");
var breakLabelDisplay = document.querySelector("#break-label");
var breakTimerDisplay = document.querySelector("#break-timer");
var infoDisplay = document.querySelector("#info");
var detailsDisplay = document.querySelector("#info-details");

var quests = [];
var curQ = -1; // index current question
var questionAnswered = false;
var gameStarted = false;
var timeRemaining = 30;
var breakTimeRemaining = 3;
var timerID = null;
var breakTimerID = null;
var results = {
  correct: 0,
  incorrect: 0,
  unanswered: 0
}

function displayNewQA() {
  curQ++;
  breakTimerDisplay.textContent = "Round Active!"
  infoDisplay.textContent = "";
  detailsDisplay.textContent = "";
  breakLabelDisplay.textContent ="";
  if (!gameStarted) {
    gameStarted = true;
    newGameBtn.style.display = "none";
    grabNewQuests();
    results = {
      correct: 0,
      incorrect: 0,
      unanswered: 0
    };
  }
  if (curQ < quests.length) {
    questionDisplay.innerHTML = quests[curQ].question;
    questionAnswered = false;
    setAnswerChoices();
    setCountdown();
  }
}

var quests = [];
function grabNewQuests() {
  var url = "https://opentdb.com/api.php?amount=10&category=17&type=multiple"
  var req = new XMLHttpRequest();
  req.onload = () => {
    quests = [];
    var json = JSON.parse(req.responseText);
    // convert objects to desired structure and puts them in quests arr
    for (var i = 0; i < json.results.length; i++) {
      var qObjOut = {};
      var qObjIn = json.results[i];
      qObjOut.question = qObjIn.question;
      qObjOut.answers = [];
      qObjOut.indexCorrect = Math.floor(Math.random() * 4);
      var x = 0;
      for (var j = 0; j < 4; j++) {
        if (j === qObjOut.indexCorrect) {
          qObjOut.answers[j] = qObjIn.correct_answer;
        } else {
          qObjOut.answers[j] = qObjIn.incorrect_answers[x];
          x++;
        }
      }
      quests.push(qObjOut);
    }
  }
  req.open("GET", url, false);
  req.send();
}

function setAnswerChoices() {
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
  if (timerID) clearInterval(timerID);
  timeRemaining = 30;
  timerDisplay.textContent = timeRemaining;
  timerID = setInterval(tick, 1000);
}

function handleAnswer(answerVal) {
  if (!questionAnswered) {
    breakTimerDisplay.textContent = 3
    questionAnswered = true;
    breakLabelDisplay.textContent ="Break remaining:";
    if (answerVal == quests[curQ].indexCorrect) {
      results.correct++;
      infoDisplay.textContent = "Correct!!";
      detailsDisplay.textContent = "You did it!";
    } else {
      results.incorrect++;
      var correctAnswer = quests[curQ].answers[quests[curQ].indexCorrect];
      infoDisplay.textContent = "Wrong!!";
      detailsDisplay.textContent = "Correct answer was: " + correctAnswer;
    }
    startBreak();
  }
}

function startBreak() {
  clearInterval(timerID);
  timerID = null;
  breakTimeRemaining = 3;
  breakTimerID = setInterval(breakTick, 1000);
}

function tick() {
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
  if (timerID) clearInterval(timerID);
  curQ = -1;
  gameStarted = false;
  newGameBtn.textContent = "New Questions!"
  newGameBtn.style.display = "inline-block";
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

newGameBtn.addEventListener("click", () => {
  if (!gameStarted) displayNewQA();
});
