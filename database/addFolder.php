<?php 
	require_once "modules/WLP.php";

	$obj = json_decode((string)$_POST["folder"], true);
	
	echo $GLOBALS["WLP"]->addFolder($obj["title"], $obj["id"], $obj["testList"]);
?>