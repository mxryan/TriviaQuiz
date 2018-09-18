var timerDisplay = document.querySelector("#timer");
var questionDisplay = document.querySelector("#question");
var answerDisplay = document.querySelector("#answer-choices");
var curQ = -1; // index current question
var questionAnswered = false; // flag to decide if question unanswered after time's up
var timeRemaining = 30;
var timerID = null;
var results = {
  correct: 0,
  incorrect: 0,
  unanswered: 0
}
var quests = [{
    question: "One of the earliest known recipes for chicken pie is dated from when?",
    answers: ["Before 2000BC", "Around 100BC", "100AD", "1557"],
    indexCorrect: 0
  },
  {
    question: "What is blue?",
    answers: ["one", "two", "three", "four"],
    indexCorrect: 0
  },
  {
    question: "Where did bread baking begin?",
    answers: ["Ancient Rome", "Ancient Greece", "Ancient China", "Ancient Mars"],
    indexCorrect: 1
  },
  {
    question: "The world's oldest oven was discovered in 2014 in Croatia. How old was it?",
    answers: ["500 years old", "1,027 years old", "6,500 years old", "10,200 years old"],
    indexCorrect: 2
  },
  {
    question: "In the year 1 AD, approximately how many bakers were there in Rome?",
    answers: ["3", "About 50", "About 300", "Over 9000!"],
    indexCorrect: 2
  }
]



function displayNewQA() {
  curQ++;
  questionDisplay.textContent = quests[curQ].question;
  questionAnswered = false;
  setAnswerChoices();
  setCountdown();
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
  console.log(results);
  displayNewQA();
}

function setCountdown(){
  if (timerID) clearInterval(timerID);
  timeRemaining = 30;
  timerDisplay.textContent = timeRemaining;
  timerID = setInterval(tick, 1000);
}

function tick() {
  timeRemaining--;
  timerDisplay.textContent = timeRemaining;
  if (timeRemaining === 0) {
    displayNewQA();
    if(!questionAnswered) results.unanswered++;

  }
  
  
}

displayNewQA();

