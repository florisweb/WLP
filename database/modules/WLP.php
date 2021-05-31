<?php
	require_once "DB_extension.php";


	class _WLP extends _DBExtension {
	    public function addFolder($_title, $_id, $_testList) {
	    	$_title 	= (string)$_title;
	    	$_id 		= (int)$_id;
	    	$_testList 	= (array)$_testList;

	    	$folderList = $GLOBALS["DBExtension"]->getFolderTree();
	    	if (!$folderList) $folderList = array();

	    	$folderObj = array();
	    	$folderObj["title"] 	= $_title;
	    	$folderObj["id"] 		= $_id;
			$folderObj["testList"] 	= $_testList;

			$folderList = $this->_addObjToList($folderObj, $folderList);

			return $GLOBALS["DBExtension"]->setFolderTree($folderList);
		}


		public function addTest($_title, $_id, $_subA, $_subB, $_testList) {
	    	$_id 		= (int)$_id;
	    	$testObj = $this->_createTestObj($_title, $_id, $_subA, $_subB, $_testList);
	    	if (!$testObj) return false;

	    	$testList = $GLOBALS["DBExtension"]->getTestTree();
	    	if (!$testList) $testList = array();

	    	$testList = $this->_addObjToList($testObj, $testList);
		
			return $GLOBALS["DBExtension"]->setTestTree($testList);
		}

		private function _createTestObj($_title, $_id, $_subA, $_subB, $_testList) {
			$_title 	= (string)$_title;
	    	$_id 		= (int)$_id;
	    	$_subA 		= (string)$_subA;
	    	$_subB	 	= (string)$_subB;

	    	$_date = date("d-m-Y");
	    	if (sizeof($_testList) < 1 || $_title === "" || $_id === 0) return false;

	    	$testObj = array();
	    	$testObj["title"] 	= $_title;
	    	$testObj["id"] 		= $_id;
	    	$testObj["subA"] 	= $_subA;
	    	$testObj["subB"] 	= $_subB;
			$testObj["list"] 	= array();
			$testObj["createDate"] = $_date;

	    	//$_testList = 2d array, [0][0] = question [0][1] = answer
			for ($i = 0; $i < sizeof($_testList); $i++)
			{
				$cur = $_testList[$i];
				if (sizeof($cur) < 2) continue;
			
				for ($x = 0; $x < sizeof($cur); $x++) $cur[$x] = (string)$cur[$x];
				array_push($testObj["list"], $cur);
			}
			return $testObj;
		}

		//takes the object, and the list (test- or folderlist) And adds the object to it, except if the there already is an object with the same id, then it overwrites it
		private function _addObjToList($_obj, $_list) {
			$found = false;
			for ($i = 0; $i < sizeof($_list); $i++)
			{
				if ((int)$_list[$i]["id"] === (int)$_obj["id"])
				{
					if ($found === false)
					{
						$_list[$i] = $_obj;
						$found = true;
					} else {
						unset($_list[$i]);
					}
				}
			}
			if ($found === false) array_push($_list, $_obj);

			return $_list;
		}







		public function getTestById($_testId) {
			$_testId = (int)$_testId;
			$testTree = $GLOBALS["DBExtension"]->getTestTree();
			if (!$testTree) return false;


			for ($i = 0; $i < sizeof($testTree); $i++)
			{
				if ($testTree[$i]["id"] === $_testId) return $testTree[$i];
			}
			return false;
		}

		private function getFolderById($_folderId) {
			$_folderId = (int)$_folderId;
			$folderTree = $GLOBALS["DBExtension"]->getFolderTree();

			if ($_folderId == 0) return false;

			for ($i = 0; $i < sizeof($folderTree); $i++)
			{
				if ($folderTree[$i]["id"] == $_folderId) return $folderTree[$i];
			}
			return false;
		}

		public function getTestsBySearchTerm($_searchTerm) {
			$_searchTerm = (string)$_searchTerm;
			if ($_searchTerm === "") return false;

			$testTree = $this->getTestTree();
			if (!$testTree) return "E1";

			$returnArr = array();
			for ($i = 0; $i < sizeof($testTree); $i++)
			{
				if ($this->isLike($testTree[$i], $_searchTerm))
				{
					array_push($returnArr, $testTree[$i]);
				}
			}

			return $returnArr;
		}

		private function isLike($_obj, $_searchTerm) {
			return $this->compareStr($_obj["title"], $_searchTerm);	
		}

		private function compareStr($_a, $_b) {
			$_a = trim(strtolower($_a));
			$_b = trim(strtolower($_b));

			similar_text($_a, $_b, $perc);
			if (sizeof(explode($_b, $_a)) > 1) $perc += 50;

	 		if ($perc > 80) return true; //80% is the treshold for how alike they must be.
			return false;
		}









		public function removeTestById($_testId) {
			$_testId = (int)$_testId;
			if ($GLOBALS["WLP"]->getTestById($_testId) === false) return "E1"; //Test doesn't exist
			
			$testTree = $GLOBALS["DBExtension"]->getTestTree();
			if (!$testTree) return false;


			for ($i = 0; $i < sizeof($testTree); $i++)
			{
				if ($testTree[$i]["id"] === $_testId)
				{
					array_splice($testTree, $i, 1);

					if ($GLOBALS["DBExtension"]->setTestTree($testTree) === false) return false;
					return $i; //Returns the index
				}
			}
			return false;
		}

		public function removeFolderById($_folderId) {
			$_folderId = (int)$_folderId;

			if ($GLOBALS["WLP"]->getFolderById($_folderId) === false) return "E1"; //Folder doesn't exist
			
			$folderTree = $GLOBALS["DBExtension"]->getFolderTree();
			if (!$folderTree) return false;


			for ($i = 0; $i < sizeof($folderTree); $i++)
			{
				if ($folderTree[$i]["id"] === $_folderId)
				{
					array_splice($folderTree, $i, 1);

					return $GLOBALS["DBExtension"]->setFolderTree($folderTree);
				}
			}
			return false;
		}
















		public function getSubjectList() {
			$subjectList = array();
			$testList = $GLOBALS["WLP"]->getTestTree();

			for ($i = 0; $i < sizeof($testList); $i++)
			{
				$exists = false;

				for ($x = 0; $x < sizeof($subjectList); $x++)
				{
					$val = $GLOBALS["WLP"]->compareSubjects($testList[$i], $subjectList[$x]);
					if ($val !== false)
					{
						$exists = true;
						array_push($subjectList[$x]["list"], $testList[$i]["id"]);
						break;
					}
				}

				if ($exists === false) 
				{
					$obj = array();
					$obj["subA"] = $testList[$i]["subA"];
					$obj["subB"] = $testList[$i]["subB"];
					$obj["list"] = array();
					array_push($obj["list"], $testList[$i]["id"]);
					array_push($subjectList, $obj);
				}

			}	
			return $subjectList;
		}



		private function testTwoSubjects($_sub1, $_sub2) {
			$_sub1 = trim(strtolower($_sub1));
			$_sub2 = trim(strtolower($_sub2));

			similar_text($_sub1, $_sub2, $perc);
				if ($perc > 80) return true; //80% is the treshold for how alike they must be.
			return false;
		}

		public function compareSubjects($_obj1, $_obj2) {
			if ($this->testTwoSubjects($_obj1['subA'], $_obj2['subA']) &&
				$this->testTwoSubjects($_obj1['subB'], $_obj2['subB']))
			{
				return 1; //1 means that they compare in the normal way
			} else if ($this->testTwoSubjects($_obj1['subA'], $_obj2['subB']) &&
				$this->testTwoSubjects($_obj1['subB'], $_obj2['subA']))
			{
				return 2; //2 means that they compare in reverse
			}
			
			return false;
		}


	}

	global $WLP;
	$WLP = new _WLP();
?>