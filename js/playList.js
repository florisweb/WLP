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















