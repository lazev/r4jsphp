<?php
require '../config.inc.php';
require R4PHP .'r4iniend.php';

require ROOT .'login/login.class.php';

$login = new Login;

$db->connect(DBBASE, INDEXTABLE);

switch($_REQUEST['com']) {

case 'login':

	$ret = $login->check([
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
	R4::dieAPI(0, 'Nenhum comando válido informado');
}

require R4PHP .'r4iniend.php';