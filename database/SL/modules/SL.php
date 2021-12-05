<?php
	require_once "SL_addWord.php";
	require_once "../modules/WLP.php";



	class _SL {
		public $AWTWL;

		public function __construct() {
			//Add Word To Word List
			$this->AWTWL = new _addWordToWordList();
		}

		/**
		* @param 0: subject A
		* @param 1: subject B
		* @param 2: cap (optional)
		*/

		public function getSmartList($_subA, $_subB, $_cap = 0) {
			function setWordRatio($_wordList) {
				$retList = $_wordList;
				for ($x = 0; $x < sizeof($retList); $x++)
				{
					$val = (int)$retList[$x]["TW"] / ((int)$retList[$x]["TW"] + (int)$retList[$x]["TR"]);
					$val = $val - ((int)$retList[$x]["TR"] * 0.001);
					if ($val < 0) $val = 0;
					$retList[$x]["ratio"] = (int)round($val * 1000); 
				}

				return $retList;
			}

			function switchQuestionAnswer($curObj) {
				$question = $curObj["q"];
				$curObj["q"] = $curObj["a"];
				$curObj["a"] = $question;
				return $curObj;
			}

			function testSubjects($subA, $subB, $searchSubA, $searchSubB) {
				if (testTwoSubjects($searchSubA, $subA) &&
					testTwoSubjects($searchSubB, $subB))
				{
					return 1; //1 means that they compare in the normal way
				} else if (testTwoSubjects($searchSubA, $subB) &&
					testTwoSubjects($searchSubB, $subA))
				{
					return 2; //2 means that they compare in reverse
				}
				return false;
			}

			function testTwoSubjects($_sub1, $_sub2) {
				$_sub1 = trim(strtolower($_sub1));
				$_sub2 = trim(strtolower($_sub2));

				similar_text($_sub1, $_sub2, $perc);
		 		if ($perc > 80) return true; //80% is the treshold for how alike they must be.
				return false;
			}



			if (!isset($_subA) || !isset($_subB)) return "E1"; //Invalid parameters
			if ($GLOBALS["DBExtension"]->userId === 0) return "E2"; //User not loged in

			$_subA = (string)$_subA;
			$_subB = (string)$_subB;
			$_cap = (int)$_cap;


			$returnObject["wordList"] = array();			
			$returnObject["subA"] = $_subA;
			$returnObject["subB"] = $_subB;

			$wordList = $GLOBALS["DBExtension"]->getWordTree();
			if (!$wordList || sizeof($wordList) == 0) return $returnObject;

			$wordList = setWordRatio($wordList);
			

			function sortArr($a, $b) {return $a["ratio"] < $b["ratio"];}
			usort($wordList, "sortArr");



			if ($_cap === 0) $_cap = sizeof($wordList);
			for ($i = 0; $i < sizeof($wordList); $i++)
			{
				if ($_cap === 0) break;
				$curObj = $wordList[$i];

				$rightSubject = testSubjects($curObj["subA"], $curObj["subB"], $_subA, $_subB);

				if ($rightSubject === 2) $curObj = switchQuestionAnswer($curObj);

				if ($rightSubject !== false)
				{
					unset($curObj["ratio"]);
					unset($curObj["subA"]);
					unset($curObj["subB"]);

					array_push($returnObject["wordList"], $curObj);
					$_cap -= 1;
				}
			}

			return $returnObject;
		}	


		public function updateWord($_question, $_answer, $_subA, $_subB, $_wordRight = 0) {
			$_question 	= (string)$_question;
			$_answer 	= (string)$_answer;
			$_subA		= (string)$_subA;
			$_subB 		= (string)$_subB;
			$_wordRight	= (int)$_wordRight;

			if (!isset($_question) || !isset($_answer) || !isset($_subA) || !isset($_subB)) return "E1"; //Invalid parameters
			if ($GLOBALS["DBExtension"]->userId === 0) return "E2"; //User not loged in

			$wordList = $GLOBALS["DBExtension"]->getWordTree();

			$wordObj["q"] = $_question;
			$wordObj["a"] = $_answer;
			$wordObj["subA"] = $_subA;
			$wordObj["subB"] = $_subB;
	
			//test if the word is already in the list
			$wordAlreadyExists = $this->AWTWL->testIfWordAlreadyExists($wordList, $wordObj);

			if (isset($wordAlreadyExists["i"]))
			{
				$wordList[$wordAlreadyExists["i"]] = $this->AWTWL->mergeWords(
															$wordList[$wordAlreadyExists["i"]], 
															$wordObj, 
															$wordAlreadyExists["s"]
														);
				if ($_wordRight == 1)
				{
					$wordList[$wordAlreadyExists["i"]]["TR"] = (int)$wordList[$wordAlreadyExists["i"]]["TR"] + 1;
				} else {
					$wordList[$wordAlreadyExists["i"]]["TW"] = (int)$wordList[$wordAlreadyExists["i"]]["TW"] + 1;
				}
			} else {
				if ($_wordRight == 1)
				{
					$wordObj["TR"] = 1;
				} else {
					$wordObj["TW"] = 1;
				}

				array_push($wordList, $wordObj);
			}

			return $GLOBALS["DBExtension"]->setWordList($wordList);
		}


		public function addTestResult($_input) {
			if (!isset($_input)) return false;
			$_date = date("H:i") . ' ' . date("d-m-Y");
			$testResultList = $GLOBALS["DBExtension"]->getTestResultsTree();

			//some simple input access control checks
			$obj = array();
			$obj["date"] = $_date;
			$obj["id"] = (int)$_input["testId"];
			$obj["score"] = (float)$_input["score"];
			if ($obj["score"] < 0) $obj["score"] = 0;
			if ($obj["score"] > 10) $obj["score"] = 10;


			$obj["list"] = array();
			for ($i = 0; $i < sizeof($_input["list"]); $i++)
			{
				$arrayItem = array();
				$curItem = $_input["list"][$i];
				
				//question Answer Relation 
				$arrayItem["QAR"] = (int)$curItem["QAR"];

				//QI = Question Index
				$arrayItem["QI"] = (int)$curItem["questionIndex"];

				//TT = Times Tried
				$arrayItem["TT"] = (int)$curItem["timesTried"];

				if ($arrayItem["TT"] > 1) array_push($obj["list"], $arrayItem);
			}

			array_push($testResultList, $obj);

			return $GLOBALS["DBExtension"]->setTestResultsTree($testResultList);
		}



		public function getWordSuggestions($_subA, $_subB, $_string) {
			//_qOrA = 0 question, = 1 = answer
			$_string = (string)$_string;
			$_str2Arr = explode("/", trim(strtolower($_string)));
			$_obj = array();
			$_obj["subA"] = (string)$_subA;
			$_obj["subB"] = (string)$_subB;
			
			$returnList = array();
			
			$wordList = $GLOBALS["DBExtension"]->getAllWordTrees();
			for ($i = 0; $i < sizeof($wordList); $i++) 
			{
				$cur = $wordList[$i];

				$subRelation = $this->AWTWL->compareSubjects($_obj, $cur);
				if ($subRelation === false) continue;
				

				$newCur = array();
				if ($subRelation === 2)
				{
					$newCur["q"] = $cur["a"];
					$newCur["a"] = $cur["q"];
				} else {
					$newCur["q"] = $cur["q"];
					$newCur["a"] = $cur["a"];
				}

				$_str1Arr = explode("/", trim(strtolower($newCur["q"])));


				$rightOptions = "";
				$score = 0;

				for ($i2 = 0; $i2 < sizeof($_str2Arr); $i2++)
				{
					for ($i1 = 0; $i1 < sizeof($_str1Arr); $i1++)
					{
						$cur1 = $_str1Arr[$i1];
						$cur2 = $_str2Arr[$i2];

						similar_text($_str1Arr[$i1], $_str2Arr[$i2], $perc);

						if (sizeof(explode($cur2, $cur1)) > 1 && strlen($cur1) > 3) $perc += 30;
						
						$score = $perc;
		 				if ($perc > 60 - (strlen($cur1) * 2))
		 				{
		 					if ($rightOptions !== "") $rightOptions .= "/";
		 					$rightOptions .= $_str1Arr[$i1];
		 				}
					}
				}
				
		 		if ($rightOptions !== "") 
		 		{
		 			//add it to the list
			 		$newCur["search"] = $_string;
			 		$newCur["score"] = $score;
		 			array_push($returnList, $newCur);
		 		}
			}
						
			function cmp($a, $b) {return $b["score"] > $a["score"];}			
			usort($returnList, "cmp");

			return array_splice($returnList, 0, 5);
		}
	}


	global $SL;
	$SL = new _SL();
?>