<?php
	$root = realpath($_SERVER["DOCUMENT_ROOT"]);
	require_once __DIR__ . "/../modules/DB_extension.php";
	require_once __DIR__ . "/modules/SL.php";
	

	echo updateWordList();
	function updateWordList() {
		$testListTree = $DBExtension->getTestTree();
		$wordListTree = $DBExtension->getWordTree();


		$userId = (int)$_SESSION['userId'];
		if ($userId === 0) return "E2"; //User not loged in


		$newWordListTree = array();

		for ($i = 0; $i < sizeof($testListTree); $i++)
		{
			$curObj = $testListTree[$i];

			//WI = word Index
			for ($WI = 0; $WI < sizeof($curObj[4]); $WI++)
			{
				if (!isset($curObj[4][$WI]) || !isset($curObj[5][$WI])) continue;

				$newWordObj = array();
				$newWordObj["q"] = $curObj[4][$WI];
				$newWordObj["a"] = $curObj[5][$WI];
				$newWordObj["subA"] = $curObj[1];
				$newWordObj["subB"] = $curObj[2];


				$_newWordListTree = $GLOBALS["SL"]->AWTWL->mergeWords($newWordListTree, $newWordObj);
				if ($_newWordListTree !== false) $newWordListTree = $_newWordListTree;
			}
		}



		for ($i = 0; $i < sizeof($wordListTree); $i++) 
		{	
			$curObj = $wordListTree[$i];

			// NI = question Index
			for ($NI = 0; $NI < sizeof($newWordListTree); $NI++) 
			{
				$NICurObj = $newWordListTree[$NI];

				if (compareWords($curObj, $NICurObj) === true)
				{
					$newWordListTree[$NI]["TR"] = $curObj["TR"];
					$newWordListTree[$NI]["TW"] = $curObj["TW"];
				}
			}
		}


		function compareWords($_word1, $_word2) {
			$switched = ___compareSubjects($_word1, $_word2);
			if ($switched == 1)
			{
				$compareVal = ___compareStrings($_word2["q"], $_word1["q"]);
				if ($compareVal !== false) return true;

				$compareVal = ___compareStrings($_word2["a"], $_word1["a"]);
				if ($compareVal !== false) return true;
			
			} else if ($switched == 2) 
			{
				$compareVal = ___compareStrings($_word2["q"], $_word1["a"]);
				if ($compareVal !== false) return true;

				$compareVal = ___compareStrings($_word2["a"], $_word1["q"]);
				if ($compareVal !== false) return true;
			}
			return false;
		}



		// prepare and bind
		return $GLOBALS["DBExtension"]->setWordList($newWordListTree);
	}
?>