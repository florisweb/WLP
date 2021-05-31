<?php 
	require_once "modules/SL.php";

	$_input = json_decode((string)$_POST["result"], true);	
	echo $SL->addTestResult($_input);
?>