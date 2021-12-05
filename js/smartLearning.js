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

		this.applyFirstSuggestion = function() {
			if (!curSuggestionArray[0]) return;
			applySuggestion(curSuggestionArray[0]["q"]);
		}

		let curSuggestionArray = [];
		this.addSuggestionsByArray = function(_arr) {
			curSuggestionArray = _arr;
			if (!this.enabled) return;
			this.clearSuggestions();
			if (!_arr || _arr.length === 0) return this.hideSuggestionMenu();

			this.showSuggestionMenu();
			for (let i = 0; i < _arr.length; i++)
			{
			  this.addSuggestion(_arr[i]["search"], _arr[i]["q"], _arr[i]["a"]);  
			}
		}

		this.addSuggestion = function(_string, _suggestion, _answer) {
			if (!this.enabled) return;
			let html = '<div class="modernFont WS_item_sItem optionStyle hide"></div>';
			let prefIndex = document.getElementsByClassName("modernFont WS_item_sItem optionStyle").length;
			this.html.listHolder.insertAdjacentHTML("beforeend", html);

			html = document.getElementsByClassName("modernFont WS_item_sItem optionStyle")[prefIndex];

			document.getElementsByClassName("modernFont WS_item_sItem optionStyle")[prefIndex].onclick = function () {
				applySuggestion(_suggestion);
			};

			setTextToElement(html, String(_suggestion));
			setTextToElement(document.getElementsByClassName("WS_item_sItem searchStyle")[0], _string);
			var loopTimer = setTimeout("document.getElementsByClassName('modernFont WS_item_sItem optionStyle')[" + prefIndex + "].classList.remove('hide')", 1);
		}

		function applySuggestion(_suggestion) {
			SL.WS.clearSuggestions(); 
			SL.WS.hideSuggestionMenu(); 
			SL.WS.selectedInput.value = String(_suggestion);
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
