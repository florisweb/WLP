<?php
	require_once "modules/WLP.php";

	echo json_encode($WLP->getSubjectList());
?>