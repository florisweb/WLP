/**
* author: Floris Bollen <license@florisweb.dev>
* version: 1.0.0
* license: MIT
*/

var REQUEST = {};
REQUEST.debug = false;
REQUEST.REQUESTList = [];
REQUEST.send = function(url, info, callBack) {
  let request = this.createRequest(url, info, callBack);
  REQUEST.sendRequest(request.id);
}


REQUEST.sendRequest = function(id) {
  let request = REQUEST.getRequestById(id);
  if (!request) return;

  if (REQUEST.debug) console.log("sendRequest", id);

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {REQUEST.handleResponse(request.id, this)};

  xhttp.open("POST", request.url, true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(request.info);


  var loopTimer = setTimeout("REQUEST.sendRequest(" + id + ")", 1000 * (request.count + 1));
}

REQUEST.handleResponse = function(id, response) { 
  let request = REQUEST.getRequestById(id);
  request.count++;

  if (response.status == 200 && response.readyState == 4)
  {
    //succes 
    try {request.callBack(response);}
    catch (e) {};
    REQUEST.removeRequestById(id);
    if (REQUEST.debug) console.log("CallBack(): " + request.id);
  }
}




REQUEST.createRequest = function(url, info, callBack) {
  let request = {};
  request.url = url;
  request.info = info;
  request.callBack = callBack;
  request.id = Math.round(Math.random() * 100000000);
  request.count = 0;

  this.REQUESTList.push(request);
  return request;
}


REQUEST.getRequestById = function(id) {
  let REQUESTListL = REQUEST.REQUESTList.length;
  for (let i = 0; i < REQUESTListL; i++)
  {
    if (REQUEST.REQUESTList[i].id == id)
    {
      return REQUEST.REQUESTList[i];
    }
  }
  return false;
}

REQUEST.removeRequestById = function(id) {
  let REQUESTListL = REQUEST.REQUESTList.length;
  for (let i = 0; i < REQUESTListL; i++)
  {
    if (REQUEST.REQUESTList[i].id == id)
    {
      return REQUEST.REQUESTList.splice(i, 1);
    }
  }
  return false;
}


