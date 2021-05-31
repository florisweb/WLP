console.warn("client.js: loaded");
function _client() {
  console.warn("- client: created");
  
  this.action = new function () {
    this.playList = new _playlist();
    this.test = new _client_action_test();
  };


  this.page = new _page();
  function _page() {
    this.index = 0;
    this.create   = new _client_page_create();
    this.change   = new _client_page_change();
    this.results  = new _client_page_results();

    this.recents  = new _client_page_recents();
    this.search   = new _client_page_search();
    this.folderContent = new _client_page_folderContent();


    




    this.constructor.prototype.open = function(_number) {
      function animatePageInByNumber(number) {
        let target = document.getElementsByClassName('contentPage')[number];
        target.classList.remove("hide");
      } 

      function animatePageOutByNumber(number) {
        let target = document.getElementsByClassName('contentPage')[number];
        target.classList.add("hide");
      }


      FB.showButtonsByPageIndex(_number);

      switch (_number)
      {
        case 5: 
          $("#WS_toggleButton").fadeIn(300); 
          client.action.playList.stopPlayList();
        break;
        case 1: break; //
        case 2: break; //
        case 3: break; //
        case 4: break; //
        default: 
          $("#WS_toggleButton").fadeOut(300); 
          client.action.playList.stopPlayList();
        break;
      }


      for (let i = 0; i < document.getElementsByClassName('contentPage').length; i++)
      {
        if (i !== _number) animatePageOutByNumber(i);
      }
      animatePageInByNumber(_number);
    }
  }
}






function _client_page_create() {
  this.open = function() {
    FB.setTitle("Create a Test");
    client.page.open(5);

    MC.page.create.clearAllInputs();
    document.getElementById('MC_page_create_title').focus();

    $(".MC_page_changeButton").fadeOut(1);  
    $(".MC_page_createButton").fadeIn(1); 
  }



  this.getTestFromHTML = function(_id) {
    let title = document.getElementById('MC_page_create_title').value == "" ? "Untitled" : document.getElementById('MC_page_create_title').value ;
    let subA = document.getElementById('MC_page_create_subA').value == "" ? "Subjectless" : document.getElementById('MC_page_create_subA').value ;
    let subB = document.getElementById('MC_page_create_subB').value == "" ? "Subjectless" : document.getElementById('MC_page_create_subB').value ;

    let list = [];
    let questionInputs = document.getElementsByClassName('MC_page_create_questionInput');
    let answerInputs = document.getElementsByClassName('MC_page_create_answerInput');

    for (let i = 0; i < questionInputs.length; i++)
    { 
      let valQ = typeof questionInputs[i].value == "undefined" ? "" : questionInputs[i].value;
      let valA = typeof answerInputs[i].value == "undefined" ? "" : answerInputs[i].value;
      list.push([valQ, valA]);
    }
    
    for (let i = list.length - 1; i >= 0; i--)
    {
      if (list[i][0] == "" && list[i][1] == "") list.splice(i, 1);
    } 
   
    let error = MC.page.create.checkIfTestIsValid(list);
    if (error !== true) return {error: error};

    let obj = {}
    obj.title = title;
    obj.subA = subA;
    obj.subB = subB;
    obj.list = list;
    obj.id = _id;

    return server.test.filterObj(obj);        
  }

  this.createTest = function(_id, _export = true) {
    let test = this.getTestFromHTML(_id);
    if (test.error) return app.notification.add(test.error);
    
    test = server.test.update(test, _export, 0);
    client.action.test.prepare(test.id);

    return test;
  }
}





function _client_page_change() {
  this.curTestId = "";
  this.open = function(_id) {
    console.log("CHANGE TEST:", _id);
    this.curTestId = parseInt(_id);
    
    client.page.open(5);
  
    MC.page.create.clearAllInputs();
    prepareChangeTest(_id);
  }

  function prepareChangeTest(_id) {
    let _testInfo = server.test.get(_id);
    if (!_testInfo) return;
    
    FB.setTitle("Change " + _testInfo.title);


    $(".MC_page_changeButton").fadeIn(1);  
    $(".MC_page_createButton").fadeOut(1); 
    document.getElementById('MC_page_create_title').focus();


    document.getElementById('MC_page_create_title').value = _testInfo.title;
    document.getElementById('MC_page_create_subA').value  = _testInfo.subA;
    document.getElementById('MC_page_create_subB').value  = _testInfo.subB;

    document.getElementsByClassName('MC page_create questionAndAnswerHolder')[0].innerHTML = "";
    for (let i = 0; i < _testInfo.list.length + 2; i++) MC.page.create.addInputRow();

    let questionInputs = document.getElementsByClassName('MC_page_create_questionInput');
    let answerInputs = document.getElementsByClassName('MC_page_create_answerInput');
    for (let i = 0; i < _testInfo.list.length; i++)
    {
      if (_testInfo.list[i][0]) questionInputs[i].value  = _testInfo.list[i][0];
      if (_testInfo.list[i][1]) answerInputs[i].value    = _testInfo.list[i][1];
    }
  }


  this.saveChanges = function() {
    let _test = client.page.create.getTestFromHTML(this.curTestId);
    if (_test.error) return app.notification.add(_test.error);

    _test = server.test.update(_test, true);
    client.action.test.prepare(_test.id);
    return _test;
  }
}



















function _client_page_recents() {
  let html = {
    _: document.getElementsByClassName("contentPage")[0]
  }

  this.open = function() {
    FB.setTitle("Navigator - Recents");
    client.page.open(0);
    prepareRecents();
    Navigator.reset();
  }


  function prepareRecents() {
    html._.innerHTML = "";

    Navigator.addListTitle("Recents", {}, html._);
    let amountOfRecentTests = app.settings.page.recents.maxRecentLists;
    for (let x = 0; x < server.test.list.length; x++)
    {
      if (amountOfRecentTests <= 0) break;
      let test = server.test.list[x];
      if (!test || test.temp) continue;
      Navigator.addTestItem(test.id);
      amountOfRecentTests--;
    }


    //it's a little empty arround here text
    if (server.test.list.length == 0) html._.innerHTML += '<div class="navigator_item withSubTitle" onclick="client.page.create.open()">' + 
                  '<img class="navigator_item_icon" src="images/listIcon.png">' +
                  '<div class="navigator_item_title">It seems a little empty around here,</div>' +
                  '<img class="navigator_item_img" src="images/addIcon.png">' + 
                  '<div class="navigator_item_subTitle">Click on the "+ Test"-button in the upper left to add a test.</div>' +
                '</div>';


    if (server.folder.list.length > 0) Navigator.addListTitle("Folders", {}, html._);
    for (let x = 0; x < server.folder.list.length; x++)
    {
      let id = server.folder.list[x].id;
      if (id) Navigator.addFolderItem(id);
    }


    //add the subject-preview
    for (let i = 0; i < server.subject.list.length; i++)
    {
      let subjects = server.subject.list[i];
      if (subjects.list.length < 1) continue;
      

      Navigator.addListTitle(subjects.subA + " - " + subjects.subB, {
        button: {
          title: "Smart List", 
          action: function () {SL.ST.startSmartListBySubjects(subjects.subA, subjects.subB)}
        }
      }, html._);

      let maxTestsPerSubject = app.settings.page.recents.maxListsPerSubject;
      for (let x = subjects.list.length - 1; x >= 0; x--)
      {
        if (maxTestsPerSubject == 0) break;
        Navigator.addTestItem(subjects.list[x], {selectable: true, showSubjects: false});
        maxTestsPerSubject--;
      }
    }

    for (let i = 0; i < 5; i++) Navigator.addDevider(undefined, html._);
  }
}









function _client_page_search() {
  let html = {
    _: document.getElementsByClassName("contentPage")[0]
  }

  this.open = function() {
    FB.setTitle("Navigator - search");
    client.page.open(0);
    prepareSearch();
    Navigator.reset();
  }


  function prepareSearch() {
    html._.innerHTML = "";
    let searchBox = Navigator.addInputField(undefined, undefined, client.page.search.searchHandler); //client.page.search.searchHandler(this.value)}
    
    searchBox.children[1].select();
  }


  this.searchHandler = function() {
    data.getTestBySearchTerm(this.value);
  }

  this.fillListByTestIds = function(_ids) {
    //A. remove all items that aren't in the list
    //B. leave all items that are in the list and remove them from the list so they won't be added again,
    let targets = document.getElementsByClassName('navigator_item');
    for (let i = targets.length - 1; i >= 0; i--)
    {
      let targetId = parseInt(targets[i].getAttribute('itemId'));
      if (!targetId) continue;
      if (isInArray(_ids, targetId)) 
      {
        _ids = removeItemFromArray(_ids, targetId); 
        continue;
      }

      targets[i].parentNode.removeChild(targets[i]);
    }

    //add all tests that were not in the HTML list
    for (let i = 0; i < _ids.length; i++)
    {
      let curId = _ids[i];
      if (String(curId).substr(0, 1) == "2")
      {
        Navigator.addFolderItem(curId);
      } else {
        Navigator.addTestItem(curId);
      }
    }
  }
}









function _client_page_folderContent() {
  let html = {
    _: document.getElementsByClassName("contentPage")[0]
  }
  let curFolderId = "";

  this.open = function(_folderId, _trial = 0) {
    let folder = server.folder.get(_folderId);
    if (!folder) return;
    curFolderId = _folderId;

    FB.setTitle("Navigator - Folder: " + folder.title);
    client.page.open(0);
    prepareFolder(folder, _trial);
    Navigator.reset();

    $("#FB_removeItemsFromFolderButton").fadeIn(1);
  }


  function sortFolderList(_folderList) {
    let folderList = Object.assign([], _folderList);
    let returnList = [];
    for (let i = 0; i < folderList.length; i++)
    {
      let curId = parseInt(folderList[i]);
      let obj = {id: curId, title: ""}

      if (String(curId).substr(0, 1) == "2")
      {
        obj.title = server.folder.get(curId).title;
      } else {
        obj.title = server.test.get(curId).title;
      }

      if (typeof obj.title == "string") returnList.push(obj);
    }

    returnList.sort(function(a, b){
      if (a.title < b.title) return -1;
      if (a.title > b.title) return 1;
      return 0;
    });

    return returnList;
  }

  function prepareFolder(_folder, _trial) {
    html._.innerHTML = "";

    Navigator.addFolderItem(_folder.id, {selectable: false, showOpenButton: false});
    Navigator.addDevider("rgba(255, 255, 255, 0.2)");
  

    let folderList = sortFolderList(_folder.testList);

    for (let i = 0; i < folderList.length; i++) 
    {
      let curId = parseInt(folderList[i].id);
      if (String(curId).substr(0, 1) == "2")
      {
        Navigator.addFolderItem(curId);
      } else {
        Navigator.addTestItem(curId);
      }
    }


    if (folderList.length !== _folder.testList.length) 
    {
      html._.innerHTML += "<img src='images/loadingIcon.gif' class='loadingIcon'>";
    
      _trial = (parseInt(_trial) + 1);
      if (_trial < 4) {
        var loopTimer = setTimeout("client.page.folderContent.open(" + _folder.id + ", " + _trial + ")", 500 * parseInt(_trial) + 50);
      } else {
        // client.page.recents.open();
        app.notification.add("An error accured: folderContent - timeout")
      }
    }
    

    //for some space at the bottom (aka for scrolling)
    for (let i = 0; i < 5; i++) Navigator.addDevider(undefined, html._);
  }

  this.removeSelectedItemsFromFolder = function() {
    if (Navigator.select.items.length == 0) return false;
    Navigator.folder.removeItemsFromFolder(curFolderId, Navigator.select.items);
    Navigator.select.items = [];
    client.page.folderContent.open(curFolderId);
  }
}










function _client_page_results() {
  var results;
  var callBack;
  var title = "";
  let overallScore = 0;

  var html = {
    noteHolder: document.getElementById('MC_page_test_results_noteHolder'),
    resultHolder: document.getElementById('MC_page_test_results_resultsHolder')
  }


  function sendResultsToServer(_results) {
    _results.score = calculateScore(_results.rightAnswers, _results.wrongAnswers);
    server.test.results.export(_results); 
  }


  this.open = function(_results, _title, _callBack) {
    
    // Send the results to the server for further analytics.
    if (!isArray(_results))
    {
      sendResultsToServer(_results);
      _results = [_results];
    }
     

    if (!_title) _title = server.test.get(_results[0].testId).title;
    results = _results;
    title = _title;
    callBack = _callBack;




    let totalScore = 0;
    for (let i = 0; i < _results.length; i++)
    { 
      if (!server.test.get(_results[i].testId)) continue;

      _results[i].score = calculateScore(_results[i].rightAnswers, _results[i].wrongAnswers);
      totalScore += _results[i].score;
      addTimesTriedHTMLInfo(_results[i], i == 0);
    }

    
    overallScore = Math.round(totalScore / _results.length * 10) / 10;
    html.noteHolder.value = "Your result: " + overallScore
    
    client.page.open(4);
    FB.setTitle("Results: " + title);

    //for some space at the bottom (aka for scrolling)
    for (let i = 0; i < 5; i++) Navigator.addDevider(undefined, html.resultHolder);

    var loopTimer = setTimeout(client.page.results.executeCallBack, 10);
  }

  this.constructor.prototype.executeCallBack = function() {
    try {callBack(results)} 
    catch(e) {};
  }


  function calculateScore(_rightAnswers, _wrongAnswers) {
    return Math.round((9 * (_rightAnswers / (_rightAnswers + _wrongAnswers)) + 1) * 10) / 10;
  }


  function addTimesTriedHTMLInfo(_results, _clearInnerHTML = true) {
    
    function addRow(_questionAndAnswer, _timesFailed, _parent) {
      let prevIndex = document.getElementsByClassName("MC_page_test_results_questionHolder").length;
      let html = '<div class="MC_list_item"><div class="MC_page_test_results_questionHolder"></div><div class="MC_page_test_results_questionHolder"></div><div class="MC_page_test_results_timesTriedHolder">' + _timesFailed + '</div><div class="navigator_item_scoreIndicator"></div></div>';
      _parent.insertAdjacentHTML("beforeend", html);

      html = document.getElementsByClassName("MC_page_test_results_questionHolder")[prevIndex].parentNode;
      setTextToElement(html.children[0], _questionAndAnswer[0]);
      setTextToElement(html.children[1], _questionAndAnswer[1]);

      if (typeof _timesFailed !== "number") return;
      let scoreRating = _timesFailed / 4;
      let timesTriedColor = "rgba(" + Math.round(200 * scoreRating + 55) + ", " + Math.round(255 * (1 - scoreRating)) + ", " + Math.round(30 * scoreRating) + ",";

      html.children[3].style.background = "linear-gradient(to bottom, " + timesTriedColor + " 0.9), " + timesTriedColor + " 0.7)";
    }
    
    let curTest = server.test.get(_results.testId);
    if (!curTest) return;

    if (_clearInnerHTML)
    {
      html.resultHolder.innerHTML = "<br>";
    } else {
      html.resultHolder.innerHTML += "<br><br><br>";
    }

    addRow(["Question", "Answer"], "times wrong", html.resultHolder)
    html.resultHolder.innerHTML += "<br>";
    
    for (let i = 0; i < _results.list.length; i++)
    {
      let timesTried = _results.list[i].timesTried;
      let questionAndAnswer = curTest.list[
        _results.list[i].questionIndex
      ];
      addRow(questionAndAnswer, (parseInt(timesTried) - 1) / 2, html.resultHolder);
    }
  }



  function createListWithWrongAnswers(_export = false) {
    let list = getWrongAnswers();
    if (!list) return false;

    let firstTest = server.test.get(results[0].testId);
    let obj = {
      title: "[R] " + title,
      subA: firstTest.subA,
      subB: firstTest.subB,
      list: list,
      temp: true
    }

    let newTest = server.test.update(obj, _export);
    
    return newTest;
  }

  this.startListWithWrongAnswers = function(_export = false) {
    let _newTest = createListWithWrongAnswers(_export);
    client.action.test.prepare(_newTest.id);
  }


  function getWrongAnswers() {
    let returnList = [];
    for (let r = 0; r < results.length; r++)
    {

      let curTest = server.test.get(results[r].testId);
      if (!curTest) continue;
    
      for (let i = 0; i < results[r].list.length; i++)
      {
        if (results[r].list[i].timesTried > 1)
        {
          returnList.push(
            curTest.list[results[r].list[i].questionIndex]
          );
        }
      }
    }

    return returnList;
  } 

  this.testIfThereAreWrongAnswers = function() {
    if (!results) return false;
    return overallScore !== 10;
  }
}



