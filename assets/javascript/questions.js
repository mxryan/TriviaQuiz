// https://opentdb.com/api_config.php
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
