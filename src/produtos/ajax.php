<?php
require '../config.inc.php';
require R4PHP .'r4iniend.php';

require ROOT .'produtos/produtos.class.php';

$produtos = new Produtos;


switch($_REQUEST['com']) {

	case 'getInit':

		R4::retOkAPI();

		break;


	case 'read':

		$cod = (int)$_REQUEST['codProduto'];

		$dados = $produtos->read($cod);

		if($dados === false) {
			R4::dieAPI(0, $produtos->errMsg, $produtos->errObs);
		}

		R4::retOkAPI([
			'produto' => $dados
		]);

		break;


	case 'save':

		$cod = (int)$_REQUEST['codProduto'];

		$dados = $produtos->save($cod, $_REQUEST);

		if($dados === false) {
			R4::dieAPI(0, $produtos->errMsg, $produtos->errObs);
		}

		R4::retOkAPI([
			'produto' => $dados
		]);

		break;


	case 'list':

		$listFilter = $_REQUEST['listFilter'];
		$listParams = $_REQUEST['listParams'];

		$dados = $produtos->list($listFilter, $listParams);

		if($dados === false) {
			R4::dieAPI(0, $produtos->errMsg, $produtos->errObs);
		}

		R4::retOkAPI([
			'list' => $dados['list'],
			'info' => $dados['info']
		]);

		break;


	case 'delete':

		$ids = $_REQUEST['ids'];

		$dados = $produtos->delete($ids);

		if($dados === false) {
			R4::dieAPI(0, $produtos->errMsg, $produtos->errObs);
		}

		R4::retOkAPI([
			'deleted' => $dados['deleted'],
			'alert'   => $dados['alert']
		]);

		break;


	default:
		R4::dieAPI(0, 'Nenhum comando válido informado');
}

require R4PHP .'r4iniend.php';