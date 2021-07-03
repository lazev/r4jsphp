<?php
require_once '../config.inc.php';
require_once ROOT .'_vendor/r4/src/php/r4iniend.php';

require_once ROOT .'painel/painel.class.php';
$painel = new Painel;

$check = $db->connect(null, '_sistema');
if($check === false) {
	R4::dieAPI(0, $db->errMsg, $db->errObs);
}


switch($_REQUEST['com']) {

	case 'getInit':

		$contas = $painel->listarContas(R4::getSession('userCod'));

		R4::retOkAPI();

		break;

	default:
		R4::dieAPI(0, 'Nenhum comando valido informado');
}


require ROOT .'_vendor/r4/src/php/r4iniend.php';