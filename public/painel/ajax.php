<?php
require '../config.inc.php';
require R4PHP .'r4iniend.php';

require ROOT .'painel/painel.class.php';

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


require R4PHP .'r4iniend.php';