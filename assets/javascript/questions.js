// https://opentdb.com/api_config.php

var quests = [];

var url = "https://opentdb.com/api.php?amount=10&category=17&type=multiple"
var req = new XMLHttpRequest();
req.onload = () => {
  console.log(req.responseText);
  var json = JSON.parse(req.responseText);
  console.log(json);
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
  console.log(quests);
}
req.open("GET", url, false);
req.send();

