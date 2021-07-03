<?php

class Produtos {

	public $errMsg = '';
	public $errObs = '';


	public function listar() {
		global $db;

		$ret = $db->sql("
			select *
			from `produtos`
			where ativo = 1
		");

		return $ret;
	}


	public function salvar($codProduto, $dados) {
		global $db;

		$codProduto = (int)$codProduto;


		$hora = $db->sql("select now() as 'agora' limit 1");

		$codConta = $db->insert('contas', [
			'codUser' => $userCod,
			'nome'    => $contaNome,
			'dtCad'   => $hora['agora']
		]);

		$pega = $db->sql("
			select codigo, nome, dtCad, dtAcesso
			from `contas`
			where codigo='$codConta'
			limit 1
		");

		$check = $this->createDB($codConta);
		if($check === false) return false;

		$db->connect(null, '_lazev');

		if(empty($pega['nome'])) {

			$nome = 'Conta id #'. $codConta;

			$db->sql("
				update `usuarios`
				set nome='$nome'
				where codigo='$codConta'
				limit 1
			");

			$pega['nome'] = $nome;
		}

		return $pega;
	}
}