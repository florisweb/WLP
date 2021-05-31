<?php 
	require_once "modules/SL.php";

	$_subA = (string)$_POST["subA"];
	$_subB = (string)$_POST["subB"];
	$_string = (string)$_POST["string"];
	if (!isset($_subA) || !isset($_subA) || !isset($_string)) die(0);

	echo json_encode($SL->getWordSuggestions($_subA, $_subB, $_string));
?>
