<?php
	require_once "modules/WLP.php";

	echo $GLOBALS["WLP"]->removeFolderById((int)$_POST["id"]);
?>