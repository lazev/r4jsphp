<?php
require '../config.inc.php';
require R4PHP .'r4iniend.php';

require ROOT .'login/login.class.php';

$login = new Login;

$db->connect(DBBASE, INDEXTABLE);

switch($_REQUEST['com']) {

case 'getInit':

	require_once 'providers/facebook.php';
	$fb = new Facebook;

	require_once 'providers/google.php';
	$gg = new Google;

	R4::retOkAPI([
		'logged'    => $login->checkKeepLogged(),
		'fbAuthUrl' => $fb->getAuthorizationUrl(),
		'ggAuthUrl' => $gg->getAuthorizationUrl()
	]);

	break;


case 'login':

	$userCod = $login->check([
		'user' => $_REQUEST['user'],
		'pass' => $_REQUEST['pass']
	]);

	if($userCod === false) {
		die(json_encode([
			'error'  => 1,
			'errMsg' => $login->errMsg,
			'errObs' => $login->errObs
		]));
	}

	if(isset($_REQUEST['save']) && $_REQUEST['save'] == 1) {
		$login->genKeepLogged($userCod);
	}

	R4::retOkAPI([
		'logged' => 1
	]);

	break;


default:
	R4::dieAPI(0, 'Nenhum comando válido informado');
}

require R4PHP .'r4iniend.php';