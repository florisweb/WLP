<?php 
	require_once "modules/WLP.php";

	$obj = json_decode($_POST["test"], true);
	echo $WLP->addTest(
		(string)$obj["title"], 
		(int)$obj["id"], 
		(string)$obj["subA"], 
		(string)$obj["subB"], 
		$obj["list"]
	);
?>