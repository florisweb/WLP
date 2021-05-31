


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




  // server.test.update(JSON.parse("{\"id\":15634931231324212, \"title\":\"x\",\"subA\":\"Nederlands\",\"subB\":\"Duits\",\"list\":[[\"0\",\"0\"],[\"0\",\"0\"],[\"0\",\"0\"],[\"0\",\"0\"],[\"0\",\"0\"],[\"0\",\"0\"],[\"0\",\"0\"],[\"0\",\"0\"],[\"0\",\"0\"],[\"0\",\"0\"],[\"0\",\"0\"],[\"0\",\"0\"]]}"), false);


  // server.test.update(JSON.parse("{\"id\":155634932,\"title\":\"(3) Frans voca h 6 A, A - longText\",\"subA\":\"Nederlands\",\"subB\":\"Frans\",\"list\":[[\"0\",\"asdfliasdjilfjasdlkfjlaksdjfklasdjklfjkl hello we gehtk asdn flkasdjfl jasdlkfjlasd jflkj1\"],[\"2\",\"3 adsklfjalksdjflkajsdlkfjasdlkfjklasjdklfjkalsdjlkasdjlfkjaldskfjlkas klj sdajflk a lkasdf lkasdfj asdlkf asdlkfjasdlkjfas d\"],[\"4\",\"5 asd dsalkf jasdlkfjasdjf lkasdf asd lkf jasdlkfj asdl kalsdjkf  ldafslk dafsljk dfas l\"],[\"6\",\"7\"],[\"8\",\"9\"]]}"), false);
  // server.test.update(JSON.parse("{\"id\":155634933,\"title\":\"(3) Frans voca h 6 A, B\",\"subA\":\"Nederlands\",\"subB\":\"Frans\",\"list\":[[\"0\",\"1\"],[\"2\",\"3\"],[\"4\",\"5\"],[\"6\",\"7\"],[\"8\",\"9\"]]}"), false);
  // server.test.update(JSON.parse("{\"id\":15115634934,\"title\":\"(3) Frans voca h 6 A, C\",\"subA\":\"Nederlands\",\"subB\":\"Frans\",\"list\":[[\"0\",\"1\"],[\"2\",\"3\"],[\"4\",\"5\"],[\"6\",\"7\"],[\"8\",\"9\"]]}"), false);
  // server.test.update(JSON.parse("{\"id\":150563493123,\"title\":\"(3) Duits voca h 6 A, X\",\"subA\":\"Nederlands\",\"subB\":\"Duits\",\"list\":[[\"0\",\"1\"],[\"2\",\"3\"],[\"4\",\"5\"],[\"6\",\"7\"],[\"8\",\"9\"]]}"), false);
  // server.test.update(JSON.parse("{\"id\":15634931234,\"title\":\"(3) Duits voca h 6 A, D\",\"subA\":\"Nederlands\",\"subB\":\"Duits\",\"list\":[[\"0\",\"1\"],[\"2\",\"3\"],[\"4\",\"5\"],[\"6\",\"7\"],[\"8\",\"9\"]]}"), false);
  
  // server.test.update(JSON.parse("{\"id\":1556349323,\"title\":\"(3) Frans voca h 6 A, A\",\"subA\":\"Nederlands\",\"subB\":\"Frans\",\"list\":[[\"0\",\"1\"],[\"2\",\"3\"],[\"4\",\"5\"],[\"6\",\"7\"],[\"8\",\"9\"]]}"), false);
  // server.test.update(JSON.parse("{\"id\":1556349334,\"title\":\"(3) Frans voca h 6 A, B\",\"subA\":\"Nederlands\",\"subB\":\"Frans\",\"list\":[[\"0\",\"1\"],[\"2\",\"3\"],[\"4\",\"5\"],[\"6\",\"7\"],[\"8\",\"9\"]]}"), false);
  // server.test.update(JSON.parse("{\"id\":151156349344,\"title\":\"(3) Frans voca h 6 A, C\",\"subA\":\"Nederlands\",\"subB\":\"Frans\",\"list\":[[\"0\",\"1\"],[\"2\",\"3\"],[\"4\",\"5\"],[\"6\",\"7\"],[\"8\",\"9\"]]}"), false);
  // server.test.update(JSON.parse("{\"id\":150563493121233,\"title\":\"(3) Duits voca h 6 A, X\",\"subA\":\"Nederlands\",\"subB\":\"Duits\",\"list\":[[\"0\",\"1\"],[\"2\",\"3\"],[\"4\",\"5\"],[\"6\",\"7\"],[\"8\",\"9\"]]}"), false);
  // server.test.update(JSON.parse("{\"id\":15634931231324,\"title\":\"(3) Duits voca h 6 A, D\",\"subA\":\"Nederlands\",\"subB\":\"Duits\",\"list\":[[\"0\",\"1\"],[\"2\",\"3\"],[\"4\",\"5\"],[\"6\",\"7\"],[\"8\",\"9\"]]}"), false);


  // server.test.update(JSON.parse("{\"id\":11,\"title\":\" A ads alkdsajfl k dasjflkdjas lkfjkalsdjfklas jdfklads jflkajsdl kf jalsdkf jlkadsj flkj asdl\",\"subA\":\"Nederlands\",\"subB\":\"Fran asdlfjlaksdf lkasdj flkasdj lkfjds akfjaldks fjlkadsj flkjasdlkfj asdlkfj lasdkj flkasdjlkfj alsdkjfss\",\"list\":[[\"0\",\"asdfliasdjilfjasdlkfjlaksdjfklasdjklfjkl hello we gehtk asdn flkasdjfl jasdlkfjlasd jflkj1\"],[\"2\",\"3 adsklfjalksdjflkajsdlkfjasdlkfjklasjdklfjkalsdjlkasdjlfkjaldskfjlkas klj sdajflk a lkasdf lkasdfj asdlkf asdlkfjasdlkjfas d\"],[\"4\",\"5 asd dsalkf jasdlkfjasdjf lkasdf asd lkf jasdlkfj asdl kalsdjkf  ldafslk dafsljk dfas l\"],[\"6\",\"7\"],[\"8\",\"9\"]]}"), false);

  // server.test.update(JSON.parse("{\"id\":12,\"title\":\"B\",\"subA\":\"Nederlands\",\"subB\":\"Frans\",\"list\":[[\"0\",\"1\"],[\"2\",\"3\"],[\"4\",\"5\"],[\"6\",\"7\"],[\"8\",\"9\"]]}"), false);
  // server.test.update(JSON.parse("{\"id\":13,\"title\":\"C\",\"subA\":\"Nederlands\",\"subB\":\"Frans\",\"list\":[[\"0\",\"1\"],[\"2\",\"3\"],[\"4\",\"5\"],[\"6\",\"7\"],[\"8\",\"9\"]]}"), false);
  // server.test.update(JSON.parse("{\"id\":14,\"title\":\"D\",\"subA\":\"Nederlands\",\"subB\":\"Duits\",\"list\":[[\"0\",\"1\"],[\"2\",\"3\"],[\"4\",\"5\"],[\"6\",\"7\"],[\"8\",\"9\"]]}"), false);
  // server.test.update(JSON.parse("{\"id\":15,\"title\":\"E\",\"subA\":\"Nederlands\",\"subB\":\"Duits\",\"list\":[[\"0\",\"1\"],[\"2\",\"3\"],[\"4\",\"5\"],[\"6\",\"7\"],[\"8\",\"9\"]]}"), false);
  
  // server.test.update(JSON.parse("{\"id\":16,\"title\":\"F\",\"subA\":\"Nederlands\",\"subB\":\"Frans\",\"list\":[[\"0\",\"1\"],[\"2\",\"3\"],[\"4\",\"5\"],[\"6\",\"7\"],[\"8\",\"9\"]]}"), false);
  // server.test.update(JSON.parse("{\"id\":17,\"title\":\"G\",\"subA\":\"Nederlands\",\"subB\":\"Frans\",\"list\":[[\"0\",\"1\"],[\"2\",\"3\"],[\"4\",\"5\"],[\"6\",\"7\"],[\"8\",\"9\"]]}"), false);
  // server.test.update(JSON.parse("{\"id\":18,\"title\":\"H\",\"subA\":\"Nederlands\",\"subB\":\"Frans\",\"list\":[[\"0\",\"1\"],[\"2\",\"3\"],[\"4\",\"5\"],[\"6\",\"7\"],[\"8\",\"9\"]]}"), false);
  // server.test.update(JSON.parse("{\"id\":19,\"title\":\"I\",\"subA\":\"Nederlands\",\"subB\":\"Duits\",\"list\":[[\"0\",\"1\"],[\"2\",\"3\"],[\"4\",\"5\"],[\"6\",\"7\"],[\"8\",\"9\"]]}"), false);


  // server.folder.update({title: "Frans", id: 22324567893, testList: [11, 12, 13]}, false);
  // server.folder.update({title: "Frans - ", id: 22324567891, testList: [11, 12, 13, 14, 15, 16, 17, 18, 19]}, false);
  // server.folder.update({title: "Duits", id: 22324567890, testList: [15115634934, 150563493123, 155634932, 155634933]}, false);
  

  // server.subject.list = JSON.parse("[{\"subA\":\"Nederlands\",\"subB\":\"Duits\",\"list\":[150563493121233,150563493123,19767996326185504]},{\"subA\":\"Nederlands\",\"subB\":\"Frans\",\"list\":[16181654778638370,13904928041745756,14281792293058012]},{\"subA\":\"sphere\",\"subB\":\"kilometer\",\"list\":[1357235259669175,13983156743844012]},{\"subA\":\"Month\",\"subB\":\"length\",\"list\":[16604843857101348]}]");
  

  // client.action.playList.start([155634932, 22324567890], "Test")
  // client.action.playList.start([155634932, 22324567890, 155634933, 15115634934, 150563493123, 15634931234, 156349312341234567890, 1556349323, 1556349334, 151156349344, 150563493121233, 15634931231324], "Test")

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


