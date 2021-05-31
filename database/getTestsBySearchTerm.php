<?php
	require_once "modules/WLP.php";

	$_searchTerm = (string)$_POST['search'];
	echo json_encode($GLOBALS["WLP"]->getTestsBySearchTerm($_searchTerm));
?>