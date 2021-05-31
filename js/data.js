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


