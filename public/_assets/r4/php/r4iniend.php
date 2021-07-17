<?php
if(!defined('R4ALREADYINIT')) {
	define('R4ALREADYINIT', true);

	require 'r4.class.php';
	require 'db.class.php';

	$db = new DB();

	if(defined('DBBASE')) {
		$dbtable = (defined('DBTABLE'))  ? DBTABLE : '';
		$db->connect(DBBASE, $dbtable);
	}

} else {

	if($db) {
		$db->close();
	}

}