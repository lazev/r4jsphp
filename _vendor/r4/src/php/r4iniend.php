<?php

if(!isset($R4AlreadyInit)) {
	$R4AlreadyInit = true;

	require_once 'r4.class.php';
	require_once 'db.class.php';

	$db = new DB();
		
	if(defined('DBBASE')) {
		$dbtable = (defined('DBTABLE')) ? DBTABLE : '';
		$db->connect(DBBASE, $dbtable);
	}

} else {

	$db->close();
	
}