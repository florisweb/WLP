
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



















// let debug = {};
// debug.getFunctionSpeed = function(func) {
//   var time = new Date().getTime();
//   eval(func);
//   return new Date().getTime() - time;
// }
// debug.getMemorySize = function(elem) {
//   if (!elem) elem = data; 
//   return JSON.stringify(elem) .length;
// }
// debug.geHTMLSize = function() {
//   return $("*").length;
// }


