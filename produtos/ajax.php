<?php

require_once '../config.inc.php';
require_once ROOT .'_vendor/r4/src/php/r4iniend.php';

require_once ROOT .'produtos/produtos.class.php';
$produtos = new Produtos;

$check = $db->connect(null, '_sistema');
if($check === false) {
	R4::dieAPI(0, $db->errMsg, $db->errObs);
}


switch($_REQUEST['com']) {

	case 'getInit':

		$contas = $produtos->listarContas(R4::getSession('userCod'));

		R4::retOkAPI([
			'contas' => $contas,
			'dados' => [
				'userNome' => R4::getSession('userNome')
			],
		]);

		break;



	case 'salvarNome':

		$cod = R4::getSession('userCod');

		$ret = $produtos->salvarNome($cod, $_REQUEST['val']);

		if($ret === false) {
			R4::dieAPI(0, $produtos->errMsg, $produtos->errObs);
		}

		R4::setSession('userNome', $ret['nome']);

		R4::retOkAPI([
			'dados' => [
				'userNome' => $ret['nome']
			]
		]);


		break;



	case 'salvarConta':

		$cod = R4::getSession('userCod');

		$ret = $produtos->salvarConta($cod, $_REQUEST['nome']);

		if($ret === false) {
			R4::dieAPI(0, $produtos->errMsg, $produtos->errObs);
		}

		R4::setSession('contaCod', $ret['codigo']);

		R4::retOkAPI([
			'dados' => $ret
		]);

		break;

	case 'selConta':

		$codUser  = R4::getSession('userCod');
		$codConta = $_REQUEST['cod'];

		$ret = $produtos->selConta($codUser, $codConta);

		if($ret === false) {
			R4::dieAPI(0, $produtos->errMsg, $produtos->errObs);
		}

		//R4::dieAPI(0, '$this->errMsg', '$this->errObs');

		R4::setSession('contaCod', $codConta);
		R4::setSession('SELTABLE', 'la_'. $codConta);

		R4::retOkAPI();

		break;

	default:
		R4::dieAPI(0, 'Nenhum comando valido informado');
}


require ROOT .'_vendor/r4/src/php/r4iniend.php';