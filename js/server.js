console.warn("server.js: loaded");
function _server() {
  console.warn("- server: created");
  this.updateData = function(_cycle = false) {
    this.folder.import();
    this.subject.import();

    this.test.import.lastXTests(settings.SB.recents.cacheTestAmount);
    if (_cycle) var loopTimer = setTimeout("server.updateData(true)", 1000);
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







