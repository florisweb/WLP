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



console.warn("server.js: loaded");
function _server() {
  console.warn("- server: created");
  this.updateData = function(_cycle = false) {
    this.folder.import();
    this.subject.import();

    this.test.import.lastXTests(settings.SB.recents.cacheTestAmount);
    // if (_cycle) var loopTimer = setTimeout("server.updateData(true)", 1000);
  }



  this.test = new _test();
  function _test() {
    this.results = new _results();

    this.list = [];

    this.get = function(_testId, _importIfNotFound = true) {
      if (!_testId) return false;
      for (let i = 0; i < this.list.length; i++)
      {
        if (this.list[i].id == _testId) return this.list[i];
      }
      if (_importIfNotFound) server.test.import.testById(_testId);
      return false;
    }

    this.update = function(_obj, _export = true, _position = this.list.length) {
      let obj = []; 
      try {obj = this.filterObj(_obj);}
      catch (e) {return}
      if (!obj) return false;
      

      if (!this.get(obj.id, false))
      {
        this.list.splice(parseInt(_position), 0, obj);    
      } else {
        for (let i = 0; i < this.list.length; i++)
        {
          if (this.list[i].id !== obj.id) continue;
          this.list[i] = obj;
          break;
        }
      }

      if (_export) server.test.export.testById(obj.id);

      return obj;
    }

    this.remove = function(_id, _export = true) {
      if (!_id) return false;
      for (let i = 0; i < this.list.length; i++)
      {
        if (this.list[i].id !== _id) continue;
        this.list.splice(i, 1);
      }
      
      if (_export) server.test.export.removeTestById(_id);
    }





    this.import = new _import();
    function _import() {
      this.testById = function(_testId) {
        if (!_testId) return false;
        REQUEST.send("database/getTestById.php", "id=" + _testId, function (_resp) {server.test.import.importCallback(_resp.responseText)});
      }

      this.lastXTests = function(_X = 0) {
        REQUEST.send("database/getTestById.php", "giveLastXTests=" + _X, 
          function (response) {
            if (response.responseText == "false" || response.responseText == "") return false;
            let testList = JSON.parse(response.responseText);
            for (let i = 0; i < testList.length; i++) server.test.import.importCallback(testList[i], 0);
          }
        );
      }

      this.constructor.prototype.importCallback = function(_resp, _position) {
        let _testObj = [];
        try {
          _testObj = typeof _resp === "object" ? _resp : JSON.parse(String(_resp));
        }
        catch (e) {return}
        server.test.update(_testObj, false, _position);
      }
    }



    this.export = new _export();
    function _export() {
      this.testById = function(_id) {
        let test = server.test.get(_id);
        if (!test) return;
        test = server.test.objToData(test);

        REQUEST.send("database/addTest.php", "test=" + String(JSON.stringify(test)), function (response) {console.log('data.export.sendTestToServer', response.responseText)});
      }

      this.removeTestById = function(_id) {    
        if (!_id) return;
    
        REQUEST.send("database/removeTestById.php", "id=" + parseInt(_id), function (response) {console.log('data.export.removeTestFromServer', response.responseText)});
      }
    }





    


    this.constructor.prototype.filterObj = function(_obj) {
      if (!_obj.title || !_obj.subA || !_obj.subB || !_obj.list) return false;

      let obj = new this.testPrototype();
      obj.id    = _obj.id ? parseInt(_obj.id) : newId(false);
      obj.title = String(_obj.title);
      obj.subA  = String(_obj.subA);
      obj.subB  = String(_obj.subB);
      obj.list  = _obj.list;
      obj.temp  = !_obj.temp ? false : true;
      return obj;
    }

    this.constructor.prototype.testPrototype = function() {
      this.start = function(_callBack) {
        client.action.test.prepare(this, _callBack);
      }

      this.change = function() {
        client.page.change.open(this.id);
      }
    }

    this.constructor.prototype.objToData = function(_obj) {
      if (!_obj.title) return false;
      let rObj = {};
      rObj.id    = _obj.id ? parseInt(_obj.id) : newId(false);
      rObj.title = String(_obj.title);
      rObj.subA = String(_obj.subA);
      rObj.subB = String(_obj.subB);
      rObj.list = _obj.list;

      return rObj;
    }
  }
  
  function _results() {
    this.export = function(_result) {
      if (!_result) return false;
      REQUEST.send("database/SL/addTestResult.php", "result=" + JSON.stringify(_result), function (response) {console.log('server.test.result.export:', response.responseText)});
    }
  }






  this.folder = new _folder();
  function _folder() {
    this.list = [];

    this.get = function(_id, _importIfNotFound = true) {
      if (!_id) return false;
      for (let i = 0; i < this.list.length; i++)
      {
        if (this.list[i].id == _id) return this.list[i];
      }
      if (_importIfNotFound) this.import();
      return false;
    }

    this.update = function(_obj, _export = true) {
      let obj = []; 
      try {obj = this.filterObj(_obj);}
      catch (e) {return}
      if (!obj) return false;
      
      if (!this.get(obj.id, false))
      {
        this.list.push(obj);    
      } else {
        for (let i = 0; i < this.list.length; i++)
        {
          if (this.list[i].id !== obj.id) continue;
          this.list[i] = obj;
          break;
        }
      }

      if (_export) this.export.folderById(obj.id);

      return obj;
    }

    this.remove = function(_id, _export = true) {
      if (!_id) return false;
      for (let i = 0; i < this.list.length; i++)
      {
        if (this.list[i].id !== _id) continue;
        this.list.splice(i, 1);
      }
      
      if (_export) this.export.removeFolderById(_id);
    }





    this.import = function() {
      REQUEST.send("database/getFolderList.php", "", function (_resp) {server.folder.handleImport(_resp.responseText)});
    }

    this.constructor.prototype.handleImport = function(_inp) {
      let list = [];
      try {list = JSON.parse(_inp);}
      catch (e) {return}
      if (!list) return;

      for (let i = 0; i < list.length; i++) this.update(list[i], false);
    }


    this.export = new _export();
    function _export() {
      this.folderById = function(_id) {
        let folder = server.folder.get(_id);
        if (!folder) return;
        folder = server.folder.objToData(folder);
        REQUEST.send("database/addFolder.php", "folder=" + JSON.stringify(folder), function (response) {console.log('data.export.sendFolderToServer', response.responseText)});
      }

      this.removeFolderById = function(_id) {    
        if (!_id) return;
        console.log(_id);
        REQUEST.send("database/removeFolderById.php", "id=" + _id, function (response) {console.log('data.export.removeFolderById', response.responseText)});
      }
    }





    this.constructor.prototype.filterObj = function(_obj) {
      if (!_obj.title || !_obj.testList) return false;

      let obj = new this._folderPrototype();
      obj.id    = _obj.id ? parseInt(_obj.id) : newId(true);
      obj.title = String(_obj.title);
      obj.testList = _obj.testList;

      return obj;
    }

    this.constructor.prototype._folderPrototype = function() {
      this.import = new _import(this);
      function _import(_parent) {
        this.parent = _parent;

        this.testsFromTestList = function() {
          let testList = this.parent.testList;
          let counter = 0;
          for (let i = 0; i < testList.length; i++)
          {
            if (server.test.get(testList[i])) counter++;
          }
          return counter === testList.length;
        }
      }

      this.addTest = function(_testId) {
        if (!server.test.get(_testId)) return false;

        if (isInArray(this.testList, _testId)) return false;
        
        this.testList.push(parseInt(_testId));
      } 

      this.removeTest = function(_testId) {
        if (!isInArray(this.testList, _testId)) return false;
       
        for (let i = 0; i < this.testList.length; i++)
        {
          if (this.testList[i] != _testId) continue;
          
          this.testList.splice(i, 1);
          return true;
        }
      }

      this.update = function() {
        server.folder.update(this, true);
      }
    }

    this.constructor.prototype.objToData = function(_obj) {
      if (!_obj.title) return false;
      let rObj = {};
      rObj.id    = _obj.id ? parseInt(_obj.id) : newId(true);
      rObj.title = String(_obj.title);
      rObj.testList = _obj.testList;

      return rObj;
    }
  }






  this.subject = new _subject();
  function _subject() {
    this.list = [];

    this.import = function() {
      REQUEST.send("database/getSubjectList.php", "", function (ret) {server.subject.handleImport(ret.responseText);});
    }

    this.handleImport = function(_respText) {
      let newList = [];
      try {
        newList = JSON.parse(_respText);
      }
      catch (e) {return}
      this.list = newList;

      //download the first 3 lists from the subjectItem
      for (let i = 0; i < this.list.length; i++)
      {
        let curItem = this.list[i];
        let getMaxItems = app.settings.page.recents.maxListsPerSubject;
        for (let x = 0; x < curItem.list.length; x++)
        { 
          if (getMaxItems < 0) break;
          server.test.get(curItem.list[x], true); //if not found then import the test
          getMaxItems--;
        }
      }

    }
  }


  


  this.updateData(true);
}







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










console.warn("smartLearning.js: loaded");
function _smartLearning() {
  console.warn("- smartLearning: created");

  this.ST = new _smartTest();
  function _smartTest() {
    this.enabled = true;
    this.sendWordStatus = function(_question, _answer, _subjectA, _subjectB, wordRight) {
      if (!this.enabled) return;
      REQUEST.send("database/SL/addWord.php", 
        "q=" + _question + 
        "&a=" + _answer + 
        "&subA=" + _subjectA + 
        "&subB=" + _subjectB + 
        "&wordRight=" + wordRight, 
        function(ret){console.log("SL.wordWrong", ret.responseText); resp = ret}
      );
    }


    this.startSmartListBySubjects = function(_subjectA, _subjectB, _maxX) {
      if (!this.enabled) return;
      if (!_maxX) _maxX = 7;
      REQUEST.send("database/SL/getTopXWords.php", 
        "x=" + _maxX + 
        "&subA=" + _subjectA + 
        "&subB=" + _subjectB,
        function(ret) {
          let newTestInfo = JSON.parse(ret.responseText);
          
          if (newTestInfo.wordList.length < 1) return false;
          
          let newTest = {};
          newTest.title = "[Smart List] " + newTestInfo.subA + "-" + newTestInfo.subB;
          newTest.subA = newTestInfo.subA;
          newTest.subB = newTestInfo.subB;
          newTest.list = newTestInfo.wordList;
          newTest.temp = true;
          
          newTest = server.test.update(newTest, false);
          client.action.test.prepare(newTest.id);
        }
      );
    }




    this.getSmartListBySubjects = function(_subjectA, _subjectB, _maxX) {
      if (!this.enabled) return;
      if (!_maxX) _maxX = 7;
      REQUEST.send("database/SL/getTopXWords.php", 
        "x=" + _maxX + 
        "&subA=" + _subjectA + 
        "&subB=" + _subjectB,
        function(ret) {
          let newTest = server.test.update(JSON.parse(ret.responseText), false);
          console.log("SL.ST.getSmartListBySubjects:", newTest);
        }
      );
    }
  }

  this.WS = new _wordSuggestion();
  function _wordSuggestion() {
    this.enabled = true;


    this.html = {};
    this.html._ = document.getElementById("wordSugestionHolder");
    this.html.box = document.getElementById("wordSugestion");
    this.html.listHolder = document.getElementById("WS_itemList");

    this.selectedInput;


    this.openState = false;
    this.toggle = function() {
      if (!this.enabled) return;
      if (this.openState)
      {
        this.close();
      } else {
        this.open();
      }
    }

    this.open = function() {
      if (!this.enabled) return;
      this.openState = true;
      this.html._.classList.remove("hide"); 
      MC.makeSpaceOnRightSide(400);
    }

    this.close = function() {
      if (!this.enabled) return;
      this.openState = false;
      this.html._.classList.add("hide");
      MC.makeSpaceOnRightSide(0);
    }


    this.addSuggestion = function(_string, _suggestion, _answer) {
      if (!this.enabled) return;
      let html = '<div class="modernFont WS_item_sItem optionStyle hide"></div>';
      let prefIndex = document.getElementsByClassName("modernFont WS_item_sItem optionStyle").length;
      this.html.listHolder.insertAdjacentHTML("beforeend", html);

      html = document.getElementsByClassName("modernFont WS_item_sItem optionStyle")[prefIndex];

      document.getElementsByClassName("modernFont WS_item_sItem optionStyle")[prefIndex].onclick = function () {SL.WS.clearSuggestions(); SL.WS.hideSuggestionMenu(); SL.WS.selectedInput.value = String(_suggestion)};
      setTextToElement(html, String(_suggestion));
      setTextToElement(document.getElementsByClassName("WS_item_sItem searchStyle")[0], _string);
      var loopTimer = setTimeout("document.getElementsByClassName('modernFont WS_item_sItem optionStyle')[" + prefIndex + "].classList.remove('hide')", 1);
    }



    this.addSuggestionsByArray = function(_arr) {
      if (!this.enabled) return;
      this.clearSuggestions();
      if (!_arr || _arr.length === 0) return this.hideSuggestionMenu();

      this.showSuggestionMenu();
      for (let i = 0; i < _arr.length; i++)
      {
        this.addSuggestion(_arr[i]["search"], _arr[i]["q"], _arr[i]["a"]);  
      }
    }

    this.clearSuggestions = function() {this.html.listHolder.innerHTML = "";}
    this.hideSuggestionMenu = function() {document.getElementById("SB_WSHolder").classList.add("hide")}
    this.showSuggestionMenu = function() {document.getElementById("SB_WSHolder").classList.remove("hide")}









    this.inAir = 0;
    this.getSuggestions = function(_subA, _subB, _str) {
        if (!_subA || ! _subB || !_str || this.inAir > 10) return;
      this.inAir++;

        REQUEST.send("database/SL/getWordSuggestions.php", "subA=" + _subA + "&subB=" + _subB + "&string=" + _str, SL.WS.handleSuggestion);
    }

    this.handleSuggestion = function(ret) {
      let obj = [];
      try {
      obj = JSON.parse(ret.responseText);
      }
      catch (e) {console.log("err", e)}

      SL.WS.addSuggestionsByArray(obj);

      SL.WS.inAir--;
    }
  }
}
var data = {};
data.getTestBySearchTerm = function(searchTerm) {
  if (searchTerm.trim())
  {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = data.searchResultHandler;
    xhttp.open("POST", "database/getTestsBySearchTerm.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("search=" + searchTerm); 
  } else {
    client.page.search.fillListByTestIds([]);
  }
}


data.searchResultHandler = function() {
  if (this.readyState == 4 && this.status == 200)
  {
    let searchResultIds = [];
    if (this.responseText)
    {
      let testList = JSON.parse(this.responseText);
      for (let i = 0; i < testList.length; i++)
      {
        //requires the test and if it's not yet cached, it will be saved in JS
        let testId = parseInt(testList[i].id);
        searchResultIds.push(testId);

        if (!server.test.get(testId))
        {
          data.import.test(testList[i]);
        } 
      }
      client.page.search.fillListByTestIds(searchResultIds);
    } else if (this.responseText === "") 
    {
      client.page.search.fillListByTestIds([]);
    }
  }
}


console.warn("playlist.js: loaded");

function _playlist() {
  console.warn("- playlist: created");
  var results = [];
  let title = "";
  var html = {    
    _: document.getElementById("playlistBar"),
    contentHolder: document.getElementById("PL_contentHolder"),
    headerHolder: document.getElementById("PLB_headerHolder"),
    titleHolder: document.getElementById("PL_titleHolder"),
    toggleButton: document.getElementById("PL_toggleButton"),
    toggleButtonTextHolder: $("#PL_toggleButton .textHolder")[0]
  }

  this.settings = {
    skipPreparePage: true,
    autoPlay: true
  }

  this.list = [];



  this.setupPlayList = function() {
    html.toggleButton.classList.remove("hide");
  }
  this.stopPlayList = function() {
    html.toggleButton.classList.add("hide");
    this.close();
  }
  
  this.openState = false;


  this.openForXSeconds = function(_seconds) {
    this.open();
    var loopTimer = setTimeout("client.action.playList.close()", _seconds * 1000);
  }

  this.toggle = function() {
    if (this.openState)
    {
      this.close();
      this.openState = false;
      html.toggleButton.classList.remove("open");
    } else {
      this.open();
      this.openState = true;
    }
  }

  this.open = function() {
    MC.makeSpaceOnRightSide(370); 
    html._.classList.remove("hide");
    html.toggleButton.classList.add("open");
  }

  this.close = function() {
    MC.makeSpaceOnRightSide(0);
    html._.classList.add("hide");
    html.toggleButton.classList.remove("open");
  }






  this.start = function(_list) {
    if (!_list) return false;
    
    title = "";
    if (typeof _list !== "object" && String(_list).substr(0, 1) == "2")
    {
      let folder = server.folder.get(_list);
      title = folder.title;
      _list = folder.testList;
    }

    if (_list.length < 1) return false;

    if (!title) title = "Selection [" + _list.length + "]"; else title += " [" + _list.length + "]";
    setTextToElement(html.titleHolder, title);
    setTextToElement(html.toggleButtonTextHolder, title);
    html.contentHolder.innerHTML = "";


    results = [];
    this.list = _listConstructor();
    for (let i = 0; i < _list.length; i++) this.list.add(_list[i]);


    this.open();
    this.openState = true;
    this.setupPlayList();
    this.list.startTest(0);
  }

  function _listConstructor() {
    let list = [];

    list.add = function(_id, _position = {pos: this.length, i: 0}, _addClass = "") {
      let item = false;
      if (String(_id).substr(0, 1) == "2")
      {
        item = Navigator.addFolderItem(_id, {position: _position.pos, selectable: false, showOpenButton: false, showSize: true, identificationClass: "Identification_playListItem" + _addClass}, html.contentHolder);
        this.openFolder(_position.pos, _id, item);
      } else {
        item = Navigator.addTestItem(_id, {position: _position.pos, selectable: false, showSubjects: true, showEditButton: false, showPlayButton: false, identificationClass: "Identification_playListItem" + _addClass}, html.contentHolder);
      }

      if (!item) return;
      item.onclick = function () {client.action.playList.list.startTest(_position.pos + _position.i)};
      item.style.cursor = "pointer";
      item.classList.add("playlistItem");
      
      this.splice(_position.pos, 0, parseInt(_id));
    }


    list.index = 0;
    list.next = function() {
      if (this.length > this.index) this.index++;
      this.startTest(this.index);
    }

    list.previous = function() {
      if (this.index > 0) this.index--;;
    
      this.startTest(this.index);
    }

    list.startTest = function(_index = 0) {
      let testId = parseInt(this[_index]);
      if (!testId) return false;
      this.index = parseInt(_index);

      if (String(testId).substr(0, 1) == "2") return this.next();

      client.action.test.prepare(testId, handleTestFinishedCallBack);
      if (client.action.playList.settings.skipPreparePage) client.action.test.startTest();


      let selectedItems = document.getElementsByClassName("playlistItem selected");
      for (let i = 0; i < selectedItems.length; i++) selectedItems[i].classList.remove("selected");
      document.getElementsByClassName("playlistItem")[parseInt(_index)].classList.add("selected");
      
      slideToItemByIndex(_index);
    }
    

    list.openFolder = function(_index, _id, _folderHTML) {
      let folder = server.folder.get(_id);
      if (!folder || !_folderHTML) return;

      for (let i =  folder.testList.length - 1; i >= 0; i--)
      {
        this.add(folder.testList[i], {pos: _index + 1, i: i}, " spaceOnTheLeft");
      }
      this.next();
    }
  



    function slideToItemByIndex(_index = 0) {
      _index = (parseInt(_index) >= 0 ? parseInt(_index) : 0);

      let items = document.getElementsByClassName("Identification_playListItem");
      let item = items[_index];
      if (!item) return false;

      let itemHeight = $(item).outerHeight(true) + 10;
      let y = (item.getBoundingClientRect().top - item.parentNode.getBoundingClientRect().top) + item.parentNode.scrollTop;

      $(html.contentHolder).animate({scrollTop: y + "px"}, 500, 'swing');

      for (let i = 0; i < items.length; i++) items[i].classList.remove("selectedItem");
      items[_index].classList.add("selectedItem");
    }



    return list;
  }


  function handleTestFinishedCallBack(_results) {
    results.push(_results[0]);
    if (client.action.playList.list.length <= client.action.playList.list.index + 1 && _results[0].score == 10) return finishPlayList();
    if (client.action.playList.openState == false) client.action.playList.openForXSeconds(3.2);

    if (!client.action.playList.settings.autoPlay) return;
    let loopTimerVal = "client.action.playList.list.startTest(client.action.playList.list.index);";
    if (_results[0].score == 10) loopTimerVal = "client.action.playList.list.next();";
    var loopTimer = setTimeout(loopTimerVal, 2500);
  }

  function finishPlayList() {
    console.warn("Finished playlist", window.r = results);
    client.action.playList.stopPlayList();
    client.page.results.open(results, title);
    results = [];
    title = "";
  }
}
















var settings = {
  MC: {
    animate: {
      pageSpeed: 0.4
    }
  },
  SB: {
    animate: {
      speed: 0.9
    },
    recents: {
      cacheTestAmount: 20
    }
  }
}


var app = new _app();
function _app() {
  this.settings = {
    page: {
      recents: {
        cacheListAmount: 20,
        maxRecentLists: 5,
        maxListsPerSubject: 3,
      },
      folderContent: {}
    }
  }





  this.notification = new _notification();
  function _notification() {
    this.add = function(_text, _settings) {
      console.error("NOTIFICATION: ", _text, _settings);
    }
  }

}









var server = new _server();
var client = new _client();
var SL = new _smartLearning();








var MC = {};
MC.makeSpaceOnRightSide = function(_width) {
  let mainContentHolder = document.getElementById("mainContentHolder");
  if (screenwidth < 800) {return mainContentHolder.style.maxWidth = "100vw"; mainContentHolder.style.left = "";}
  mainContentHolder.style.maxWidth = "calc(100vw - " + _width + "px)";
}

MC.makeSpaceOnLeftSide = function(_width) {
  let mainContentHolder = document.getElementById("mainContentHolder");
  if (screenwidth < 800 || _width < 0) {return mainContentHolder.style.maxWidth = "100vw"; mainContentHolder.style.left = "";}
  mainContentHolder.style.maxWidth = "calc(100vw - " + _width + "px)";
  mainContentHolder.style.left = _width + "px";
}

MC.setWidth = function(_width = "") {
  document.getElementById("mainContent").style.maxWidth = _width;
}









var FB = new _functionBar();
function _functionBar() {
  console.warn("- functionBar: created");
  this.html = {
    _parent: document.getElementById('functionBarHolder'),
    _: document.getElementById('functionBar'),
    normalViewHolder: document.getElementById("functionBar_normalViewHolder"),
    extraOptionsViewHolder: document.getElementById("functionBar_extraOptionsViewHolder"),
    openExtraOptionsViewButton: document.getElementById('FB_openExtraOptionsViewButton'),
    title: document.getElementById("titleBarTextHolder")
  }

  this.setTitle = function(_title) {setTextToElement(this.html.title, String(_title));}


  this.showButtonsByPageIndex = function(_pageIndex = 0) {
    this.html._.style.display = "";

    let hideTargets = document.getElementsByClassName('FB TB_item');
    let hideTargetsL = hideTargets.length;
    let showTargets = document.getElementsByClassName('FB TB_item showByIndex' + _pageIndex);

    for (let i = 0; i < hideTargetsL; i++) $(hideTargets[i]).fadeOut(0);
    for (let i = 0; i < showTargets.length; i++) $(showTargets[i]).fadeIn(0);
  
    if (showTargets.length == 0) this.html._.style.display = "none";

    showTargets = document.getElementsByClassName('FB TB_item showByAllIndexes');
    for (let i = 0; i < showTargets.length; i++) $(showTargets[i]).fadeIn(0);

    this.displayExtraOptionsButton(_pageIndex);

    $("#FB_removeItemsFromFolderButton").fadeOut(0);
  }

  this.displayExtraOptionsButton = function(_pageIndex = 0) {
    let targets = document.getElementsByClassName('FB TB_item FB_extraOptionsView showByIndex' + _pageIndex);
    if (!targets) return;
    let hide = [];

    switch (_pageIndex)
    {
      case 4: console.warn("DEOB:", client.page.results.testIfThereAreWrongAnswers()); if (!client.page.results.testIfThereAreWrongAnswers()) hide.push(0, 1); break;
    }

    for (let i = 0; i < targets.length; i++) targets[i].classList.remove("optionGrayedOut");
    for (let i = 0; i < hide.length; i++) targets[hide[i]].classList.add("optionGrayedOut");

    if (hide.length === targets.length)
    {
      document.getElementById('FB_openExtraOptionsViewButton').style.display = "none";
    } else {
      document.getElementById('FB_openExtraOptionsViewButton').style.display = "block";
    }
  }



  this.openExtraOptionsView = function() {
    this.html._parent.classList.add("extraOptions");
    $(this.html.normalViewHolder).fadeOut(0);
    $(this.html.extraOptionsViewHolder).fadeIn(0);
  }

  this.closeExtraOptionsView = function() {
    this.html._parent.classList.remove("extraOptions");
    $(this.html.extraOptionsViewHolder).fadeOut(0);
    $(this.html.normalViewHolder).fadeIn(0);
  }
}














//navigator
var Navigator = new _navigator();

function _navigator() {
  let _html = {
    _: document.getElementsByClassName("contentPage")[0]
  }

  this.select = new _navigator_select();
  this.folder = new _navigator_folder();


  this.reset = function() {
    this.select.items = [];
  }

  this.curPage = 0;
  this.refreshPage = function() {

  }


  this.addTestItem = function(_id, _settings = {}, _parent = _html._) {
    let _test = server.test.get(_id);
    if (!_parent || !_test) return false;
    //settings:
    // selectable,
    // showSubjects,
    // showEditButton, 
    // showPlayButton,
    // identificationClass

    
    let htmlItemId = "navigator_item" + newId();
    let html =  '<div class="navigator_item" itemId="' + parseInt(_id)  + '" id="' + htmlItemId  + '">' + 
                  '<img class="navigator_item_icon" src="images/listIcon.png">' +
                  '<div class="navigator_item_title">Titleless</div>' +
                  '<img class="navigator_item_img" src="images/startIcon.png">' +
                  '<img class="navigator_item_img" src="images/editIcon.png">' + 
                  '<div class="navigator_item_scoreIndicator"></div>' + 
                '</div>';
    if (_test.subA && _test.subB && _settings.showSubjects !== false) html = '<div class="navigator_item withSubTitle" itemId="' + parseInt(_id)  + '" id="' + htmlItemId  + '">' + 
              '<img class="navigator_item_icon" src="images/listIcon.png">' +
              '<div class="navigator_item_title">Titleless</div>' +
              '<img class="navigator_item_img" src="images/startIcon.png">' +
              '<img class="navigator_item_img" src="images/editIcon.png">' +
              '<div class="navigator_item_scoreIndicator"></div>' + 
              '<div class="navigator_item_subTitle">subA - subB</div>' +
            '</div>';



    let siblings = _parent.children;
    let navigator_itemSiblings = [];
    for (let i = 0; i < siblings.length; i++) if (isInArray(siblings[i].classList, "navigator_item")) navigator_itemSiblings.push(siblings[i]);
          
    let insertBeforeNode = navigator_itemSiblings[_settings.position];

    html = createElementFromHTML(html);
    _parent.insertBefore(html, insertBeforeNode);  
    html = document.getElementById(htmlItemId);

    setTextToElement(html.children[1], _test.title);

    if (_settings.selectable !== false) html.addEventListener("click", function (event) {Navigator.select.toggleItem(this, event)})
    if (_settings.selectable !== false) html.classList.add("selectable");
    if (_settings.showPlayButton === false) html.children[2].style.display = "none";
    if (_settings.showEditButton === false) html.children[3].style.display = "none";
    if (_settings.identificationClass) html.className += " " + String(_settings.identificationClass);
    if (_test.subA && _test.subB && _settings.showSubjects !== false) setTextToElement(html.children[5], _test.subA + " - " + _test.subB);


    if (_settings.showScoreIndicator == true)
    {
      let scoreRating = 0 / 4;
      let timesTriedColor = "rgba(" + Math.round(200 * scoreRating + 55) + ", " + Math.round(255 * (1 - scoreRating)) + ", " + Math.round(30 * scoreRating) + ",";
      html.children[4].style.background = "linear-gradient(to bottom, " + timesTriedColor + " 0.9), " + timesTriedColor + " 0.7)";
    }



    html.children[2].addEventListener("click", function() {server.test.get(_id).start()});
    html.children[3].addEventListener("click", function() {server.test.get(_id).change()});
    return html;
  }

  this.addFolderItem = function(_id, _settings = {}, _parent = _html._) {
    let _folder = server.folder.get(_id);
    if (!_parent || !_folder) return false;

    let htmlItemId = "navigator_item" + newId();
    let html =  '<div class="navigator_item" itemId="' + parseInt(_id)  + '" id="' + htmlItemId  + '"">' + 
                  '<img class="navigator_item_icon" src="images/folderIcon.png">' +
                  '<div class="navigator_item_title">Titleless</div>' +
                  '<img class="navigator_item_img" src="images/startIcon.png">' +
                  '<img class="navigator_item_img" src="images/openFolderIcon.png">' +
                '</div>';
    if (_settings.showSize !== false) html = '<div class="navigator_item withSubTitle" itemId="' + parseInt(_id)  + '" id="' + htmlItemId  + '"">' + 
              '<img class="navigator_item_icon" src="images/folderIcon.png">' +
              '<div class="navigator_item_title">Titleless</div>' +
              '<img class="navigator_item_img" src="images/startIcon.png">' +
              '<img class="navigator_item_img" src="images/openFolderIcon.png">' +
              '<div class="navigator_item_subTitle">Size: 0</div>' +
            '</div>';

    _parent.insertAdjacentHTML("beforeend", html);
    html = document.getElementById(htmlItemId);
    setTextToElement(html.children[1], _folder.title);

    html.children[2].addEventListener("click", function () {client.action.playList.start(parseInt(_id))});
    html.children[3].addEventListener("click", function () {client.page.folderContent.open(parseInt(_id))});

    if (_settings.showPlayButton == false) html.children[2].style.display = "none";
    if (_settings.showOpenButton == false) html.children[3].style.display = "none";
    if (_settings.selectable !== false) html.addEventListener("click", function (event) {Navigator.select.toggleItem(this, event)})
    if (_settings.selectable !== false) html.classList.add("selectable");
    if (_settings.showSize !== false) setTextToElement(html.children[4], "Size: "  + _folder.testList.length);
    if (_settings.identificationClass) html.className += " " + String(_settings.identificationClass);

    return html;
  }
  


  this.addInputField = function(_iconPath = "images/searchIcon.png", _placeHolder = "Search", _callBack,  _parent = _html._) {
    let itemId = "navigator_item" + newId();
    let html =  '<div class="navigator_searchBox_holder" id="' + itemId + '">' + 
                  '<img class="navigator_searchBox_icon" src="' + _iconPath + '">' +
                  '<input class="navigator_searchBox_input" placeHolder="' + _placeHolder + '">' +
                '</div>';
    _parent.insertAdjacentHTML("beforeend", html);
    html = document.getElementById(itemId);
    html.children[1].addEventListener("keyup", _callBack);
    return html;
  }

  this.addListTitle = function(_title, _settings = {}, _parent = _html._) {
    let itemId = "navigator_item" + newId();
    let html = '<div class="navigator_test_listTitle" id="' + itemId + '"><div>Title</div></div>';
    if (_settings.button) html = '<div class="navigator_test_listTitle withButton" id="' + itemId + '"><div>Title</div><div class="navigator_test_listTitle_button">Title less</div></div>';

    _parent.insertAdjacentHTML("beforeend", html);
    html = document.getElementById(itemId);
    setTextToElement(html.children[0], _title);
    if (_settings.button && _settings.button.title) setTextToElement(html.children[1], _settings.button.title);
    if (_settings.button && _settings.button.action) html.children[1].addEventListener("click", _settings.button.action);
    if (_settings.identificationClass) html.className += " " + String(_settings.identificationClass);
    return html;
  }

  this.addDevider = function(_lineColour = "rgba(0, 0, 0, 0)",  _parent = _html._) {
    let itemId = "navigator_item" + newId();
    let html = '<div class="navigator_deviderLine" id="' + itemId + '"></div>';
    _parent.insertAdjacentHTML("beforeend", html);
    html = document.getElementById(itemId);
    html.style.borderBottom = "1px solid " + _lineColour;
    return html;
  }








  this.removeItemById = function(_id) {
    let item = this.getItemById(_id);
    item.parentNode.removeChild(item);
  }

  this.getItemById = function(_id) {
    let targets = document.getElementsByClassName("navigator_item");
    for (let i = 0; i < targets.length; i++)
    {
      if (parseInt(targets[i].getAttribute("itemId")) == parseInt(_id)) return targets[i];
    }
    return false;
  }
}





function _navigator_select() {
  this.items = [];


  this.toggleItem = function(_html, _e) {
    if (!_html || _e.target.tagName !== "DIV") return;
    let itemId = _html.getAttribute("itemId");

    if (isInArray(this.items, itemId)) return deselectItem(_html);
    return selectItem(_html);
  }

  function selectItem(_html) {
    let itemId = _html.getAttribute("itemId");
    Navigator.select.items.push(itemId);
    _html.classList.add("selected");
  }
 
  function deselectItem(_html) {
    let itemId = _html.getAttribute("itemId");
    Navigator.select.items = removeItemFromArray(Navigator.select.items, itemId);
    _html.classList.remove("selected");
  }


  this.deSelectAllItems = function() {
    let targets = document.getElementsByClassName("navigator_item selected");
    for (let i = targets.length - 1; i >= 0; i--)
    {
      targets[i].classList.remove("selected");
    }
    this.items = [];
  }



  //MTM
  this.toggleAllItems = function() {// to one side (aka same status, all false or all true)
    let targets = document.getElementsByClassName("navigator_item selectable");
    let toggleToSelected = true;

    for (let i = 0; i < targets.length; i++)
    {
      if (!isInArray(targets[i].classList, "selected")) continue;
      toggleToSelected = false;
      break;
    }

    for (let i = 0; i < targets.length; i++)
    {
      if (toggleToSelected)
      {
        selectItem(targets[i]); 
      } else {
        deselectItem(targets[i]);
      }
    }
  }


  this.removeSelectedItems = function() {
    for (let i = 0; i < this.items.length; i++)
    {
      let curId = parseInt(this.items[i]);
      Navigator.removeItemById(curId);
      if (String(curId).substr(0, 1) == "2")
      {
        server.folder.remove(curId, true);
      } else {
        server.test.remove(curId, true);
      }
    }
    this.items = [];
  }

  this.startPlayListWithSelectedItems = function() {
    client.action.playList.start(this.items);
  }
}





function _navigator_folder() {
  let _html = {
    _: document.getElementById("navigator_folderMenu"),
    holder: document.getElementById("navigator_folderMenuHolder"),
    folderHolder: document.getElementById("navigator_FM_contentHolder"),
    listCount: document.getElementById("navigator_FM_listCount")
  }

  this.selector = new _navigator_folder_selector();
  this.creator = new _navigator_folder_creator();

  this.open = function() {  
    _html.holder.classList.remove("hide");
  }

  this.close = function() {
    _html.holder.classList.add("hide");
  }


  this.removeItemsFromFolder = function(_folderId, _idList) {
    let folder = server.folder.get(_folderId);
    if (!folder || !_idList) return false;
    for (let i = 0; i < _idList.length; i++)folder.removeTest(parseInt(_idList[i]));
    
    folder.update();
  }
}




function _navigator_folder_selector() {
  let _html = {
    _: document.getElementById("navigator_folderMenu"),
    holder: document.getElementById("navigator_folderMenuHolder"),
    folderHolder: document.getElementById("navigator_FM_contentHolder"),
    listCount: document.getElementById("navigator_FM_listCount"),
    title: document.getElementById("navigator_FM_title")
  }

 
  
  this.close = function() {
    Navigator.folder.close();
  }

  this.open = function() {  
    if (Navigator.select.items.length == 0) return false;
    Navigator.folder.open();  
    prepareFolderSelector();
  }


  function prepareFolderSelector() {
    _html.title.innerHTML = "Select a folder";
  
    //set the listCount text
    let listCountText = Navigator.select.items.length + " list";
    if (Navigator.select.items.length > 1) listCountText += "s";
    _html.listCount.innerHTML = listCountText;
    _html.listCount.style.cursor = "none";
    _html.listCount.onclick = null;

    // add the folders
     _html.folderHolder.innerHTML = "";
    for (let i = 0; i < server.folder.list.length; i++)
    {
      addFolder(server.folder.list[i].id);
    } 
  }
  

  function addFolder(_id) {
    let element = Navigator.addFolderItem(_id, {selectable: true, showSize: true, showOpenButton: false, showPlayButton: false}, _html.folderHolder);
    if (!element) return;
    element.style.background = "rgba(70, 80, 100, 0.9)";
    element.addEventListener("click", function () {Navigator.folder.selector.addItemsToFolder(this.getAttribute("itemId"))})
  }



  this.addItemsToFolder = function(_itemId) {
    this.close();
    let folder = server.folder.get(_itemId);
    if (!folder) return;

    for (let i = 0; i < Navigator.select.items.length; i++)
    {
      let id = Navigator.select.items[i];
      if (String(id).substr(0, 1) == 2) continue;
      folder.addTest(id);
    }

    folder.update();
    Navigator.select.deSelectAllItems();
  }
}





function _navigator_folder_creator() {
  let _html = {
    _: document.getElementById("navigator_folderMenu"),
    holder: document.getElementById("navigator_folderMenuHolder"),
    folderHolder: document.getElementById("navigator_FM_contentHolder"),
    listCount: document.getElementById("navigator_FM_listCount"),
    title: document.getElementById("navigator_FM_title"),
    inputField: null,
  }

  this.open = function() {  
    Navigator.folder.open();  
    prepareFolderCreator();
  }


  function prepareFolderCreator() {
    //set the appropiate titles
    _html.title.innerHTML = "Create a folder";
    _html.listCount.innerHTML = "Create";
    _html.listCount.style.cursor = "pointer";
    _html.listCount.onclick = Navigator.folder.creator.createFolder;

    // add the folders
    _html.folderHolder.innerHTML = "<br>";

    _html.inputField = Navigator.addInputField("images/addIcon.png", "Title", undefined, _html.folderHolder).children[1];
    _html.inputField.addEventListener("keyup", function (e) {
      //enter
      if (e.keyCode == 13) Navigator.folder.creator.createFolder()
    });

    _html.inputField.select();
  }
  


  this.createFolder = function() {
    let title = _html.inputField.value;
    if (!title) return;
    server.folder.update({title: title, testList: []});
    Navigator.folder.close();
  }
}



















































MC.page = {};
MC.page.create = {};

MC.page.create.checkIfTestIsValid = function(list) {
  for (let i = list.length - 1; i >= 0; i--)
  {
    if ((list[i][0] == "" || list[i][0] == "/") && list[i][1] !== "" && list[i][1] !== "/")
    {
      return 'Please fill in a question.(' + (i + 1) + ')';
    } else if (list[i][1] == "" || list[i][1] == "/") 
    {
      return 'Please fill in a answer.(' + (i + 1) + ')';
    }
  } 
  if (list.length == 0) return "Add at least 1 question.";

  return true;
}




MC.page.create.clearAllInputs = function() {
  document.getElementById('MC_page_create_title').value = "";
  document.getElementById('MC_page_create_subA').value = "";
  document.getElementById('MC_page_create_subB').value = "";

  document.getElementsByClassName('MC page_create questionAndAnswerHolder')[0].innerHTML = "";
  for (let i = 0; i < 7; i++) MC.page.create.addInputRow();
}

MC.page.create.addInputRow = function() {
  let count = document.getElementsByClassName('MC_page_create_rowHolder').length + 1;
  let html = '<div class="MC_list_item MC_page_create_rowHolder"><div class="MC_page_test_results_timesTriedHolder" style="margin: 0; left: -2px; margin-right: 5px">' + count + '</div><input class="MC_page_create_halfHalfInputField MC_page_create_questionInput" placeHolder="Question"><input class="MC_page_create_halfHalfInputField MC_page_create_answerInput" placeHolder="Answer"></div>';
  document.getElementsByClassName('MC page_create questionAndAnswerHolder')[0].insertAdjacentHTML("beforeend", html);
  
  $(".MC_page_create_halfHalfInputField.MC_page_create_answerInput").on('focus', setup_handleLastAddHolder);

  let targets = document.getElementsByClassName("MC_page_create_halfHalfInputField MC_page_create_answerInput");
  for (let i = 0; i < targets.length; i++)
  {
    targets[i].onkeyup = function () {MC.page.create.getSuggestions(this.value, 1)};
  }

  targets = document.getElementsByClassName("MC_page_create_halfHalfInputField MC_page_create_questionInput");
  for (let i = 0; i < targets.length; i++)
  {
    targets[i].onkeyup = function () {MC.page.create.getSuggestions(this.value, 0)};
  }

  $(".MC_page_create_halfHalfInputField").on('focus', function () {SL.WS.selectedInput = this;})
}


MC.page.create.getSuggestions = function(str, _answer) {
  var subA = document.getElementById('MC_page_create_subA').value;
  var subB = document.getElementById('MC_page_create_subB').value;
  if (_answer) 
  {
    x = subA;
    subA = subB;
    subB = x;
  }

  SL.WS.getSuggestions(subA, subB, str);
}




















function cloneObj(obj) {return Object.assign({}, obj)}


function printArray(array) {
  for (let i = 0; i < array.length; i++)
  {
    console.log("PARR (" + i + ")", array[i]);
  }
}


function shuffleArray(array) {
    let counter = array.length;

    while (counter > 0) 
    {
        let index = Math.floor(Math.random() * counter);

        counter--;

        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
}

function isInArray(arr, item) {
  for (let i = 0; i < arr.length; i++)
  {
    if (arr[i] == item)
    {
      return true;
    }
  }
  return false;
}

function giveItemIndexInArr(_arr, _item) {
  let returnVal = [];
  for (let i = 0; i < _arr.length; i++)
  {
    if (_arr[i] == _item)
    {
      returnVal.push(i);
    }
  }
  return returnVal;
}


function isDescendant(parent, child) {
  if (parent == child) return true;
  
   var node = child.parentNode;
   while (node != null) {
       if (node == parent) {
           return true;
       }
       node = node.parentNode;
   }
   return false;
}

function setTextToElement(_element, _text) {
  if (!_element) return console.error("- setTextToElement: the element (", _element, ") doesn't exist.");
  _element.innerHTML = "";
  let a = document.createElement('a');
  a.text = String(_text);
  _element.append(a);
}

function removeItemFromArray(arr, item) {
  let newArr = [];
  for (let i = 0; i < arr.length; i++) 
  {
    if (arr[i] !== item) 
    {
      newArr.push(arr[i]);
    }
  }
  return newArr;
} 


function removeSpaceOnStartAndEnd(str) {
  let removedFirstSpacesStr = "";
  let splited = str.split(" ");
  let splitedL = splited.length;

  for (let i = 0; i < splitedL; i++)
  {
    if (removedFirstSpacesStr !== "") 
    {
      removedFirstSpacesStr += " ";
    }
    removedFirstSpacesStr += splited[i];
  }


  let removedLastSpacesStr = "";
  splited = removedFirstSpacesStr.split(" ").reverse();
  splitedL = splited.length;

  for (let i = 0; i < splitedL; i++)
  {
    if (removedLastSpacesStr !== "") removedLastSpacesStr = " " + removedLastSpacesStr;

    removedLastSpacesStr = splited[i] + removedLastSpacesStr;
  }

  return removedLastSpacesStr;
}



function getInputTypeRadioValue(parent) {
  let radios = parent.children;
  for (var i = 0, length = radios.length; i < length; i++)
  {
    if (radios[i].checked) return radios[i].value;
  }
}






function newId(_folder = false) {
  let id = parseInt(Math.round(Math.random() * 100000000) + "" + Math.round(Math.random() * 100000000));
  if (_folder) return parseInt("2" + id);
  return parseInt("1" + id);
  //tests with an one
  //folders start with a two
}


function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes
  return div.firstChild; 
}




function isArray(_item) {
  return typeof _item.length == "number" && typeof _item == "object";
}








var screenwidth = screenheight = 0;

function setup() {
  window.onresize = function(e) {
    screenwidth = "innerWidth" in window 
      ? window.innerWidth
      : document.documentElement.offsetWidth;
    screenheight = "innerHeight" in window 
      ? window.innerHeight
      : document.documentElement.offsetHeight;
  }
  window.onresize();

  // Enable the 'are you sure you want to leave'-text
  window.onbeforeunload = function(e) {
    return false;
  }
  window.onunload = function () {
    return false;
  }

  
  MC.page.create.clearAllInputs();




    
  // Listen to every click
  $('html').click(function(event) {
      let navigateBar = document.getElementById('navigateBar');
      let SB_recentlyAddedList = document.getElementById('SB_recentlyAddedList');
      let SB_multiTestMenu = document.getElementById('SB_multiTestMenu');
      let SB_searchList = document.getElementById('SB_searchList');
      let SB_curFolderHolder = document.getElementById('SB_curFolderHolder');
      let SB_selectFolderHolder = document.getElementById('SB_selectFolderHolder');
      let SB_createFolderHolder = document.getElementById('SB_createFolderHolder');

      let block = true;
      if (isDescendant(navigateBar, event.target)) block = false;
      if (isDescendant(SB_multiTestMenu, event.target)) block = false;
      if (isDescendant(SB_recentlyAddedList, event.target)) block = false;
      if (isDescendant(SB_searchList, event.target)) block = false;
      if (isDescendant(SB_curFolderHolder, event.target)) block = false;
      if (isDescendant(SB_selectFolderHolder, event.target)) block = false;
      if (isDescendant(SB_createFolderHolder, event.target)) block = false;
  }); 

  $("#MC_page_test_answerHolder").on('keyup', function (e) {if (e.keyCode == 13) client.action.test.next()});
  $("#SB_createFolderHolder_title").on('keyup', function (e) 
  {
    if (e.keyCode == 13) //enter
    { 
      SB.folders.create.createFromHTML(); 
      SB.folders.create.close();
    }
  });

  document.body.onkeyup = function(e) {
    switch (e.keyCode)
    {
      case 27: { //esc
        SB.close(); 
        break;
      }
    }
  }


  client.page.recents.open();
}


function setup_handleLastAddHolder(e) {
  let answerHolders = document.getElementsByClassName('MC_page_create_halfHalfInputField MC_page_create_answerInput');
  let answerHoldersL = answerHolders.length;
  for (let i = answerHoldersL - 1; i > 0; i--)
  {
    if (answerHolders[i] == this && i == answerHolders.length - 1)
    {
      MC.page.create.addInputRow();
      MC.page.create.addInputRow();
      return;
    }
  }
}



setup();
var loopTimerVal = setTimeout("client.page.recents.open()", 100);


