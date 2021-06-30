<?php

require_once '../config.inc.php';
require_once ROOT .'_vendor/r4/src/php/r4iniend.php';

require_once ROOT .'login/login.class.php';
$login = new Login;

switch($_REQUEST['com']) {
case 'login':

	$ret = $login->checkLogin([
		'user' => $_REQUEST['user'],
		'pass' => $_REQUEST['pass']
	]);

	if($ret === false) {
		die(json_encode([
			'error'  => 1,
			'errMsg' => $login->errMsg,
			'errObs' => $login->errObs
		]));
	}

	echo json_encode([
		'ok'     => 1,
		'logged' => 1
	]);

break;
default:
	R4::dieAPI(0, 'Nenhum comando valido informado');
}

require ROOT .'_vendor/r4/src/php/r4iniend.php';