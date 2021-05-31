<?php
	require_once "modules/WLP.php";

	$giveLastXTestsVal = (int)$_POST["giveLastXTests"];
	if ($giveLastXTestsVal !== 0)
	{
		$testlist = $GLOBALS["DBExtension"]->getTestTree();
		if (!$testlist) die("false"); //internal error

		$returnObj = array();

		for ($i = sizeof($testlist) - 1; $i >= 0; $i--)
		{
			array_unshift($returnObj, $testlist[$i]);
			
			$giveLastXTestsVal--;
			if ($giveLastXTestsVal <= 0) break;
		}

		echo json_encode($returnObj);
	} else {
		echo json_encode($GLOBALS["WLP"]->getTestById((int)$_POST["id"]));
	}
?>