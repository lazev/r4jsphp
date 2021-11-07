<?php

class Inicio {

	public $errMsg = '';
	public $errObs = '';

	public function salvarNome($userCod, $nome) {
		global $db;

		$userCod = (int)$userCod;

		if(!$userCod){
			$this->errMsg = 'Código não informado';
			$this->errObs = 'Não foi possível identificar o código do cadastro';
			return false;
		}

		if(!$nome){
			$this->errMsg = 'Nome em branco';
			$this->errObs = 'O nome não pode ficar em branco';
			return false;
		}

		$db->sql("
			update `usuarios`
			set nome = '$nome'
			where codigo = $userCod
			limit 1
		");

		$usuario = $db->sql("
			select nome
			from `usuarios`
			where codigo = $userCod
			limit 1
		");

		return $usuario;
	}


	public function listarContas($codUser) {
		global $db;

		$codUser  = (int)$codUser;

		$ret = $db->sql("
			select A.*
			from `contas` A, `usuariosContas` B
			where B.codUsuario = $codUser
			and B.codConta = A.codigo
		");

		return $ret;
	}


	public function selConta($codUser, $codConta) {
		global $db;

		$codUser  = (int)$codUser;
		$codConta = (int)$codConta;

		$ret = $db->sql("
			select codigo, situAcesso
			from `usuariosContas`
			where codigo = $codConta
			and codUsuario = $codUser
			limit 1
		");

		if(!$ret['codigo']) {
			$this->errMsg = 'Não foi possível localizar a conta';
			$this->errObs = 'Não há nenhuma conta de código '. $codConta .' para seu usuário';
			return false;
		}

		if($ret['situAcesso'] == 90) {
			$this->errMsg = 'Não foi possível acessar a conta';
			$this->errObs = 'O acesso deste usuário está bloqueado';
			return false;
		}

		$conta = $db->sql("
			select serverDB, bloqueado, ativo
			from `contas`
			where codigo = $codConta
			limit 1
		");
		
		if($conta['bloqueado']) {
			$this->errMsg = 'Não foi possível acessar a conta';
			$this->errObs = 'O acesso desta conta está bloqueado';
			return false;
		}
		
		if($conta['ativo'] == 0) {
			$this->errMsg = 'Não foi possível acessar a conta';
			$this->errObs = 'Esta conta foi inativada no sistema';
			return false;
		}
		
		$check = $db->connect($conta['serverDB'], 'la_'. $codConta);
		if($check === false) {
			$this->errMsg = 'Erro ao selecionar a base da conta';
			$this->errObs = 'A base da conta informada não foi encontrada';
			return false;
		}

		return $ret['codigo'];
	}


	public function inserirConta($userCod, $contaNome='') {
		global $db;

		if(!(int)$userCod){
			$this->errMsg = 'Código não informado';
			$this->errObs = 'Não foi possível identificar o código do usuário';
			return false;
		}

		$ret = $db->sql("insert into `contas`", [
			'serverDB'   => NEWACCOUNTSDB,
			'nome'       => $contaNome
		]);
		
		if($ret === false) {
			$this->errMsg = 'Erro ao criar a nova conta';
			$this->errObs = 'Não foi possível criar uma nova conta na base';
			return false;
		}

		$codConta = $db->getInsertId();

		$conta = $db->sql("
			select codigo, nome, dtCad, dtAcesso
			from `contas`
			where codigo = $codConta
			limit 1
		");

		$db->sql("insert into `usuariosContas`", [
			'codConta'   => $codConta,
			'codUsuario' => $userCod,
			'dono'       => 1,
			'situAcesso' => 50
		]);

		$db->connect(NEWACCOUNTSDB);
		
		$check = $this->createDB($codConta);
		if($check === false) return false;

		$db->connect(INDEXDB, INDEXTABLE);

		if(empty($conta['nome'])) {

			$nome = 'Conta id #'. $codConta;

			$db->sql("
				update `contas`
				set nome = '$nome'
				where codigo = $codConta
				limit 1
			");

			$conta['nome'] = $nome;
		}

		return $conta;
	}


	private function createDB($cod) {
		global $db;

		$cod = (int)$cod;
		if(!$cod) {
			$this->errMsg = 'Cód da conta não informado';
			$this->errObs = 'Não foi possível criar a conta';
			return false;
		}

		$db->sql("create database `la_". $cod ."` collate 'utf8mb4_general_ci';");

		if(!$db->connect(null, 'la_'. $cod)) {
			$this->errMsg = 'Erro ao criar a conta';
			$this->errObs = $db->errCod .' - '. $db->errMsg;
			return false;
		}

		$db->sql("
			CREATE TABLE `produtos` (
				`codigo` int(1) UNSIGNED NOT NULL AUTO_INCREMENT,
				`categoria` varchar(50) NOT NULL,
				`nome` varchar(100) NOT NULL,
				`preco` decimal(10,2) UNSIGNED NOT NULL,
				`comEstoque` tinyint(1) NOT NULL DEFAULT '1',
				`tags` varchar(200) NOT NULL,
				`dtCad` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
				`dtDel` datetime DEFAULT NULL,
				`ativo` tinyint(1) UNSIGNED NOT NULL DEFAULT '1',
				PRIMARY KEY (`codigo`)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
		");

		R4::setSession('SELTABLE', 'la_'. $cod);
		
		return true;
	}
}