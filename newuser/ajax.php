<?php

require_once '../config.inc.php';
require_once ROOT .'_vendor/r4/src/php/r4iniend.php';

require_once ROOT .'newuser/newuser.class.php';
$newUser = new NewUser;

switch($_REQUEST['com']) {
case 'salvar':

	$ret = $newUser->cadastrar([
		'user'  => $_REQUEST['user'],
		'pass'  => $_REQUEST['pass'],
		'pass2' => $_REQUEST['pass2']
	]);

	if($ret === false) {
		R4::dieAPI($newUser->errCod, $newUser->errMsg, $newUser->errObs);
	}

	R4::retOkAPI($ret);

break;
default:
	R4::dieAPI(0, 'Nenhum comando valido informado');
}


require ROOT .'_vendor/r4/src/php/r4iniend.php';