<?php 
	require_once "modules/SL.php";

	$_topXWorstWords = (int)$_POST['x'];
	$_subjectA = (string)$_POST['subA'];
	$_subjectB = (string)$_POST['subB'];

	$smartList = $SL->getSmartList($_subjectA, $_subjectB, $_topXWorstWords);
	if (is_string($smartList)) die($smartList);
	for ($i = 0; $i < sizeof($smartList["wordList"]); $i++)
	{
		$cur = $smartList["wordList"][$i];
		$newObj = array();
		$newObj[0] = $cur["q"];
		$newObj[1] = $cur["a"];
		$smartList["wordList"][$i] = $newObj;
	}
	
	echo json_encode($smartList);
?>	