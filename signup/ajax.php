<?php
require '../config.inc.php';
require ROOT .'_vendor/r4/src/php/r4iniend.php';

require ROOT .'signup/signup.class.php';
$signUp = new SignUp;

switch($_REQUEST['com']) {
case 'salvar':

	$ret = $signUp->cadastrar([
		'user'  => $_REQUEST['user'],
		'pass'  => $_REQUEST['pass'],
		'pass2' => $_REQUEST['pass2']
	]);

	if($ret === false) {
		R4::dieAPI($signUp->errCod, $signUp->errMsg, $signUp->errObs);
	}

	R4::retOkAPI($ret);

break;
default:
	R4::dieAPI(0, 'Nenhum comando valido informado');
}


require ROOT .'_vendor/r4/src/php/r4iniend.php';