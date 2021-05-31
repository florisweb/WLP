<?php
	$root = realpath($_SERVER["DOCUMENT_ROOT"]);
	require_once "$root/PHP/PacketManager.php";
	$PM->includePacket("DB", "1.0");
	$PM->includePacket("SESSION", "1.0");



	class _DBExtension {
		public $userId;
		private $DB;

		public function __construct() {
			$this->userId = $GLOBALS["SESSION"]->get("userId");
			$this->DB = $GLOBALS["DB"]->connect("eelekweb_floris");

			$this->addUserToTable();
		}

		private function addUserToTable() {
			if (!$this->userId) return;

			$result = $this->DB->execute("SELECT userId FROM WLP WHERE userId=?", 
				array($this->userId)
			);

			if (isset($result[0])) return true;

			return $this->DB->execute("INSERT INTO WLP (userId) VALUES (?)", 
				array($this->userId)
			);
		}
	    


		public function setFolderTree($_newVal) {
			$_newVal = (array)$_newVal;

			return $this->DB->execute("UPDATE WLP SET folderList=? WHERE userId=?", 
				array(json_encode($_newVal), $this->userId)
			);
		}

		public function setTestTree($_newVal) {
			$_newVal = (array)$_newVal;

			return $this->DB->execute("UPDATE WLP SET private_testList=? WHERE userId=?", 
				array(json_encode($_newVal), $this->userId)
			);	
		}


		public function setTestResultsTree($_newVal) {
			$_newVal = (array)$_newVal;

			return $this->DB->execute("UPDATE WLP SET SL_testResults=? WHERE userId=?", 
				array(json_encode($_newVal), $this->userId)
			);
		}

		public function setWordList($_wordList) {
			return $this->DB->execute("UPDATE WLP SET SL_wordList=? WHERE userId=?", 
				array(json_encode($_wordList), $this->userId)
			);
		}










		public function getFolderTree() {
			$result =  $this->DB->execute("SELECT folderList FROM WLP WHERE userId=?", 
				array($this->userId)
			);
			
			if (isset($result[0])) return json_decode($result[0]["folderList"], true);
			return array();
		}

		public function getTestTree() {
			$result =  $this->DB->execute("SELECT private_testList FROM WLP WHERE userId=?", 
				array($this->userId)
			);

			if (isset($result[0])) return json_decode($result[0]["private_testList"], true);
			return array();
		}

		public function getWordTree() {
			$result = $this->DB->execute("SELECT SL_wordList FROM WLP WHERE userId=?", 
				array($this->userId)
			);

			if (isset($result[0])) return json_decode($result[0]["SL_wordList"], true);
			return array();
		}

		public function getTestResultsTree() {
			$result =  $this->DB->execute("SELECT SL_testResults FROM WLP WHERE userId=?", 
				array($this->userId)
			);

			if (isset($result[0])) return json_decode($result[0]["SL_testResults"], true);
			return array();
		}

	}

	global $DBExtension;
	$DBExtension = new _DBExtension();
?>