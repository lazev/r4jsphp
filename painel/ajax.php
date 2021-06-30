<?php

require_once '../config.inc.php';
require_once ROOT .'_vendor/r4/src/php/r4iniend.php';

require_once ROOT .'painel/painel.class.php';
$painel = new Painel;

switch($_REQUEST['com']) {
	case 'getInit':


		$codConta = R4::getSession('codConta');
		if(!$codConta) {
			R4::dieAPI(10, 'Conta não selecionada', '');
		}

		R4::retOkAPI($ret);

	break;
default:
	R4::dieAPI(0, 'Nenhum comando valido informado');
}


require ROOT .'_vendor/r4/src/php/r4iniend.php';