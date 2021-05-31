<?php
	require_once "modules/WLP.php";

	echo $GLOBALS["WLP"]->removeTestById((int)$_POST["id"]);
?>