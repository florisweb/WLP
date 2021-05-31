<?php 
	class _addWordToWordList {
		public function addWordToWordList($_wordList, $_wordObj) {
			if (!isset($_wordObj["q"]) || !isset($_wordObj["a"]) || !isset($_wordObj["subA"]) || !isset($_wordObj["subB"])) return false;

	 		$wordAlreadyExistsIndex = $this->testIfWordAlreadyExists($_wordList, $_wordObj);

	 		if (isset($wordAlreadyExistsIndex["i"]))
	 		{
	 			$_wordList[$wordAlreadyExistsIndex["i"]] = $this->mergeWords(
																$_wordList[$wordAlreadyExistsIndex["i"]], 
																$_wordObj, 
																$wordAlreadyExistsIndex["s"]
															);
	 		} else {
	 			array_push($_wordList, $_wordObj);
	 		}

			return $_wordList;
		}

		public function testIfWordAlreadyExists($_wordList, $_wordObj) {
			for ($i = 0; $i < sizeof($_wordList); $i++)
			{	
				$switched = $this->compareSubjects($_wordList[$i], $_wordObj);
				if ($switched == 1)
				{
					$compareVal = $this->compareStrings($_wordObj["q"], $_wordList[$i]["q"]);
					if ($compareVal !== false) return ["i" => $i, "s" => $switched];

					$compareVal = $this->compareStrings($_wordObj["a"], $_wordList[$i]["a"]);
					if ($compareVal !== false) return ["i" => $i, "s" => $switched];
				
				} else if ($switched == 2) 
				{
					$compareVal = $this->compareStrings($_wordObj["q"], $_wordList[$i]["a"]);
					if ($compareVal !== false) return ["i" => $i, "s" => $switched];

					$compareVal = $this->compareStrings($_wordObj["a"], $_wordList[$i]["q"]);
					if ($compareVal !== false) return ["i" => $i, "s" => $switched];
				}
			}
			return false;
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

		public function compareStrings($_str1, $_str2) {
			$_str1Arr = explode("/", $_str1);
			$_str2Arr = explode("/", $_str2);

			for ($i2 = 0; $i2 < sizeof($_str2Arr); $i2++)
			{
				$isFound = 0;
				for ($i1 = 0; $i1 < sizeof($_str1Arr); $i1++)
				{
					if (trim($_str1Arr[$i1]) == trim($_str2Arr[$i2])) return true;
				}
			}
			return false;
		}

		public function mergeWords($_word1, $_word2, $switched) {
			$newWord = $_word1;
			
			if ($switched == 2) 
			{
				$newWord['q'] = $this->mergeQuestions($_word1['q'], $_word2['a']);
				$newWord['a'] = $this->mergeQuestions($_word1['a'], $_word2['q']);
			} else {
				$newWord['q'] = $this->mergeQuestions($_word1['q'], $_word2['q']);
				$newWord['a'] = $this->mergeQuestions($_word1['a'], $_word2['a']);
			}

			return $newWord;
		}

		private function mergeQuestions($_str1, $_str2) {
			$retString = $_str1;
			$_str2Arr = explode("/", $_str2);

			for ($i2 = 0; $i2 < sizeof($_str2Arr); $i2++)
			{
				$isFound = 0;
				$_str1Arr = explode("/", $retString);

				for ($i1 = 0; $i1 < sizeof($_str1Arr); $i1++)
				{
					if (trim($_str1Arr[$i1]) == trim($_str2Arr[$i2])) $isFound = 1;
				}


				if ($isFound == 0)
				{
					$retString .= "/" . $_str2Arr[$i2];
				}
			}
			return $retString;
		}
	}
?>