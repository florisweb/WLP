<?php
	require_once "modules/SL.php";
	echo $SL->updateWord($_POST['q'], $_POST['a'], $_POST['subA'], $_POST['subB'], $_POST['wordRight']);
?>