console.warn("test.js: loaded");
function _client_action_test() {
  console.warn("- test: created");



  function _prepareConstructor() {
    var html = {
      questionAnswerRelationHolder: document.getElementsByClassName("MC page_prepare questionAnswerRelationHolder")[0],
      testTypeHolder: document.getElementsByClassName("MC page_prepare testTypeHolder")[0],
      ignoreCapsHolder: document.getElementsByClassName("MC page_prepare ignoreCapsHolder")[0],
      shuffleWordsHolder: document.getElementsByClassName("MC page_prepare shuffleWordsHolder")[0],
    }

    var settings = {
      curTest: {},
      questionAnswerRelation: 0,
      //0 question -> answer
      //1 answer -> question
      //2 question <-> answer
      
      testType: 0,
      //0 default, by text
      //1 using multiple options

      shuffleWords: false,

      testAnswer: {
        ignoreCaps: false
      }
    };



    this.prepareTestById = function(_obj, callBack = function () {}) {
      settings.curTest = server.test.filterObj(_obj);
      if (!settings.curTest) return false;
      
      settings.onFinishCallBack = callBack;

      FB.setTitle('Prepare: ' + settings.curTest.title);
      client.page.open(1);
    }

    this.startTest = function() {
      settings.questionAnswerRelation = parseInt(
        html.questionAnswerRelationHolder.value
      );

      settings.testType = parseInt(
        html.testTypeHolder.value
      );

      settings.testAnswer.ignoreCaps = parseInt(
        getInputTypeRadioValue(html.ignoreCapsHolder)
      );

      settings.shuffleWords = parseInt(
        getInputTypeRadioValue(html.shuffleWordsHolder)
      );
      return settings;
    }
  }











  function _testConstructor() {
    var settings = {};
    var results;
    var questionList;

    var html = {
      rightAnswerHolder: document.getElementsByClassName('MC_page_test_rightanswerHolder'),
      questionHolders: document.getElementsByClassName('MC page_test questionHolder'),
      answerHolder: document.getElementById('MC_page_test_answerHolder'),
      optionHolders: document.getElementsByClassName('MC page_testByOption optionItem holder'),
      answerWrongHolder: document.getElementsByClassName("MC_page_test answerWrongHolder")[0],
      iWasRightButton: document.getElementsByClassName("MC_page_test_iWasRightButton"),
      nextButton: document.getElementsByClassName("MC_page_test_nextButton"),

      testInfo: {
        rightAnswers: document.getElementsByClassName('MC page_test testInfo rightAnswers'),
        wrongAnswers: document.getElementsByClassName('MC page_test testInfo wrongAnswers'),
        progress: document.getElementsByClassName('MC page_test testInfo progress')
      },

      progressBar: {
        text: document.getElementsByClassName('MC page_test progressBar_text'),
        bar: document.getElementsByClassName('MC page_test progressBar')
      }
    }

   


   
    




    setup();
    function setup() {
      for (let i = 0; i < html.iWasRightButton.length; i++)
      {
        html.iWasRightButton[i].hide = function() {this.classList.add("hide")}
        html.iWasRightButton[i].show = function() {this.classList.remove("hide")}
        html.iWasRightButton[i].hide();
      }
      for (let i = 0; i < html.nextButton.length; i++)
      {
        html.nextButton[i].hide = function() {this.classList.add("hide")}
        html.nextButton[i].show = function() {this.classList.remove("hide")}
      }
    }


    function _questionList() {
      var questionList = [];
      questionList.add = function(question, answer, index, position = this.length) {
        let QAR = settings.questionAnswerRelation;
        if (settings.questionAnswerRelation === 2) QAR = Math.round(Math.random());

        if (QAR === 0) return this.splice(position, 0, {question: question, answer: answer, i: index, QAR: 0});
        return this.splice(position, 0, {question: answer, answer: question, i: index, QAR: 1});
      }
      return questionList;
    }

    function _results() {
      var results = {
        rightAnswers: 0,
        wrongAnswers: 0,
        list: []
      }
      results.list.add = function() {
        if (questionList.length == 0) return false;
        let curQuestion = questionList[0];
        let found = false;
        for (let i = 0; i < this.length; i++)
        {
          if (this[i].questionIndex != curQuestion.i || this[i].QAR != curQuestion.QAR) continue;
          found = true;
          this[i].timesTried++;
        }
        if (!found) this.push({questionIndex: curQuestion.i, timesTried: 1, QAR: curQuestion.QAR});
      }
      return results;
    }


   

 



    this.startTest = function(_settings) {
      if (!_settings) return false;
      settings = _settings;
      results = _results();           //creates a new results list
      questionList = _questionList(); //creates a new questionlist

      prepare();
      createQuestionList(settings.shuffleWords);
      giveQuestion();
      updateTestInfo();
      return results;
    } 

    function prepare() {
      FB.setTitle(settings.curTest.title);
      switch (settings.testType)
      {
        case 0: client.page.open(3); html.answerHolder.focus(); break; //text
        case 1: client.page.open(2); break; //option
      }
      html.answerWrongHolder.classList.add("hide");
    }

    function createQuestionList(_shuffle) {
      let coupledQuestionList = [];
      for (let i = 0; i < settings.curTest.list.length; i++)
      {
        coupledQuestionList.push({
          q: settings.curTest.list[i][0],
          a: settings.curTest.list[i][1],
          i: i
        })
      }

      let shuffledQuestionList = coupledQuestionList; 
      if (_shuffle) shuffledQuestionList = shuffleArray(coupledQuestionList);

      for (let i = 0; i < shuffledQuestionList.length; i++)
      {
        questionList.add(shuffledQuestionList[i].q, shuffledQuestionList[i].a, shuffledQuestionList[i].i); 
      }
    }

    function giveQuestion() {
      //check if the test is finished
      if (!questionList[0] || questionList.length == 0) return client.action.test.finish();
      
      testingAnswer = false;
      html.answerHolder.value = null;
      html.answerHolder.focus();
      
      //set the questions to there respective holders    
      for (let i = 0; i < html.questionHolders.length; i++)
      {
        setTextToElement(
          html.questionHolders[i],        
          questionList[0].question
        );
      }
      
      if (settings.testType === 1) //option
      {
        testType.option.setAllOptionsHTMLDefault();
        testType.option.setOptions();
        html.nextButton[0].hide();
      } else {//something else (At the moment only testtype text)


      }
    }




    var showRightAnswerMode = false;
    var testingAnswer = false;
    this.testAnswer = function(_html) {  
      if (questionList.length == 0) return;
      testingAnswer = true;
    
      let result = false;
      switch (settings.testType)
      {
        case 0: result = testType.text.testAnswer(); break;
        case 1: result = testType.option.testAnswer(_html); break;
      }

      if (!result || !result.right)
      {
        showRightAnswer(result);
      } else {
        answerRight();
        this.next(); 
      }
      html.answerHolder.focus();
    }





    function showRightAnswer(_result) {
      showRightAnswerMode = true;
      for (let i = 0; i < html.iWasRightButton.length; i++) html.iWasRightButton[i].show();
      html.answerHolder.setSelectionRange(0, html.answerHolder.value.length)

      //text
      for (let i = 0; i < html.rightAnswerHolder.length; i++)
      {
        setTextToElement(
          html.rightAnswerHolder[i],
          questionList[0].answer
        );
      }
      html.answerWrongHolder.classList.remove("hide");
      
      
      //option
      if (settings.testType === 1)
      {
        if (_result.i >= 0) testType.option.setOptionHTMLWrong(_result.i);
        testType.option.setOptionHTMLRight(testType.option.optionHolderWithAnswerIndex);
        html.nextButton[0].show();
      }
    }

    function answerRight() {
      console.log("answerRight");
      results.list.add();

      SL.ST.sendWordStatus(
        questionList[0].question, 
        questionList[0].answer,
        settings.curTest.subA,
        settings.curTest.subB,
        1
      );

      questionList.splice(0, 1);
      results.rightAnswers++;
    }

    function answerWrong() {
      console.log("answerWrong");
      let question  = questionList[0].question,
          answer    = questionList[0].answer,
          index     = questionList[0].i;

      if (questionList[0].QAR === 1)
      {
        question  = questionList[0].answer;
        answer    = questionList[0].question;
      }

      results.list.add();
      SL.ST.sendWordStatus(
        question, 
        answer,
        settings.curTest.subA,
        settings.curTest.subB,
        0
      );

      questionList.splice(0, 1);
      questionList.add(question, answer, index, 3);
      questionList.add(question, answer, index);

      results.wrongAnswers++;
    }

    this.next = function(_html) {
      html.answerWrongHolder.classList.add("hide");
      for (let i = 0; i < html.iWasRightButton.length; i++) html.iWasRightButton[i].hide();

      if (!testingAnswer) return this.testAnswer(_html);
      if (showRightAnswerMode) answerWrong();
      showRightAnswerMode = false;
      giveQuestion();
      updateTestInfo();
    }

    this.iWasRight = function() {
      if (!showRightAnswerMode) return false;
      showRightAnswerMode = false;
      answerRight();
      this.next();
    }



    function updateTestInfo() {
      for (let i = 0; i < html.testInfo.rightAnswers.length; i++)
      {
        html.testInfo.rightAnswers[i].innerHTML = results.rightAnswers;
        html.testInfo.wrongAnswers[i].innerHTML = results.wrongAnswers;
        html.testInfo.progress[i].innerHTML = (questionList.length - 1) + " left";
      }

      let total = settings.curTest.list.length + results.wrongAnswers;
      let toGo = total - questionList.length;

      for (let i = 0; i < html.progressBar.text.length; i++)
      {
        html.progressBar.text[i].innerHTML = "Progress: " + toGo + "/" + total;
      }
      progressBar.set(toGo / total);
    } 


    var progressBar = {};
    progressBar.set = function(perc) {
      $(html.progressBar.bar).animate({width: (perc * 100) + "%"}, 400);
    }




    var testType = {
      text: {},
      option: {},
    };
    testType.text.testAnswer = function() {
      let rightAnswer = questionList[0].answer;
      let givenAnswer = html.answerHolder.value;

      if (rightAnswer || rightAnswer == "") return {right: this.compareAnswers(rightAnswer, givenAnswer)};
    }

    testType.text.compareAnswers = function(_rightAnswer, _givenAnswer) {
      let rightAnswers = String(_rightAnswer).split('/');
      let givenAnswers = String(_givenAnswer).split('/');
      let timesRight = 0;

      for (let riI = 0; riI < rightAnswers.length; riI++)
      {
        for (let giI = 0; giI < givenAnswers.length; giI++)
        {
          if (testAnswersWithRules(rightAnswers[riI], givenAnswers[giI])) timesRight++;
        }
      }

      return timesRight >= givenAnswers.length;

      function testAnswersWithRules(_rightAnswer, _givenAnswer) {
        _rightAnswer = removeSpaceOnStartAndEnd(_rightAnswer);
        _givenAnswer = removeSpaceOnStartAndEnd(_givenAnswer);

        if (settings.testAnswer.ignoreCaps)
        {
          _rightAnswer = _rightAnswer.toLowerCase();
          _givenAnswer = _givenAnswer.toLowerCase();
        }

        return _rightAnswer == _givenAnswer;
      }
    }





    testType.option.optionHolderWithAnswerIndex = 0;
    testType.option.setOptions = function() {
      let optionArr = giveRandomQuestionsFromInfo(settings.curTest, 4);
      let rightAnswer = questionList[0];

      //check if the right answer (by accident) came in the random options list, if so, remove it
      for (let i = 0; i < optionArr.length; i++)
      {
        if (optionArr[i].i == rightAnswer.i) optionArr.splice(i, 1);
      }

      //check if the previouw part removed one, if not do so, so that there are 3 random options
      //Then add the right answer
      if (optionArr.length !== 3) optionArr.splice(0, 1);
      optionArr.push(rightAnswer);

      shuffleArray(optionArr);

      //check which of the options has the right answer and assign the index to 'optionHolderWithAnswerIndex'
      for (let i = 0; i < optionArr.length; i++)
      {
        if (optionArr[i].i == rightAnswer.i)
        {
          this.optionHolderWithAnswerIndex = i;
        }
      } 

      //and finally add the options to the HTML-option-holders
      for (let i = 0; i < html.optionHolders.length; i++)
      {
        let curOption = html.optionHolders[i];
        setTextToElement(
          curOption,
          optionArr[i] ? optionArr[i].answer : ""
        );
        curOption.classList.add("clickable");
      }

      //all fine
      function giveRandomQuestionsFromInfo(curTest, max) {
        let returnArray = [];
        let questionCoupleList = [];

        for (let i = 0; i < curTest.list.length; i++)
        {
          questionCoupleList.push({
            q: curTest.list[i][0],
            a: curTest.list[i][1],
            i: i
          })
        }

        let shuffledQuestionCoupleList = shuffleArray(questionCoupleList);

        for (let c = 0; c < shuffledQuestionCoupleList.length; c++)
        {
          if (c >= max) break;
          let question = shuffledQuestionCoupleList[c].q;
          let answer = shuffledQuestionCoupleList[c].a;
          let index = shuffledQuestionCoupleList[c].i;
          
          switch (settings.questionAnswerRelation) 
          { 
            //question -> answer
            case 0: returnArray.push({question: question, answer: answer, i: index, QAR: 0}); break;
            //answer -> question
            case 1: returnArray.push({question: answer, answer: question, i: index, QAR: 1}); break;
            //question <-> answer
            default: {
              if (Math.round(Math.random()) == 1)
              {
                returnArray.push({question: question, answer: answer, i: index, QAR: 0});
              } else {
                returnArray.push({question: answer, answer: question, i: index, QAR: 1});
              }}; break;
          }
        }
        return returnArray;
      }
    }

    testType.option.testAnswer = function(_html) {
      let result = {right: false, i: -1};
      for (let i = 0; i < html.optionHolders.length; i++)
      {
        if (html.optionHolders[i] == _html) result = {right: testType.option.optionHolderWithAnswerIndex == i, i: i};
        html.optionHolders[i].classList.remove("clickable");
      } 
      return result;
    }

    testType.option.setOptionHTMLWrong = function(_index) {
      if (!_index && _index !== 0) return;
      html.optionHolders[_index].style.backgroundColor = "rgba(255, 0, 0, 0.8)";
    }

    testType.option.setOptionHTMLRight = function(_index) {
      if (!_index && _index !== 0) return;
      html.optionHolders[_index].style.backgroundColor = "rgba(0, 255, 0, 0.8)";
    }

    testType.option.setAllOptionsHTMLDefault = function() {
      for (let i = 0; i < html.optionHolders.length; i++)
      {
        html.optionHolders[i].style.backgroundColor = "";
      } 
    }
  }























































  var _prepare  = new _prepareConstructor();
  var _test     = new _testConstructor();
  var settings = {};
  var results  = {};
  var finished = true;



  this.prepare = function(_in, callBack) {
    let obj = _in;
    if (typeof _in !== "object") obj = server.test.get(parseInt(_in));
    if (!obj) return false;
    
    _prepare.prepareTestById(obj, callBack);
    finished = false;
  }

  this.startTest = function () {
    if (finished) return;
    settings = _prepare.startTest();
    results = _test.startTest(settings);
  }

  this.restartTest = function(_force = false) {
    this.prepare(settings.curTest, settings.onFinishCallBack);
    if (_force) this.startTest();
  }





  this.next = function(_html) {if (finished) return; _test.next(_html)};
  this.iWasRight = function() {if (finished) return; _test.iWasRight();};




  
  this.constructor.prototype.finish = function() {
    finished = true;
    results.testId = settings.curTest.id;
    client.page.results.open(results, null, settings.onFinishCallBack);
    console.log("finish", results);
  }
}










