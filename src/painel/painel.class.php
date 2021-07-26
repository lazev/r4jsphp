<?php

class Painel {

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
			set nome='$nome'
			where codigo='$userCod'
			limit 1
		");

		$pega = $db->sql("
			select nome
			from `usuarios`
			where codigo='$userCod'
			limit 1
		");

		return $pega;
	}


	public function listarContas($codUser) {
		global $db;

		$codUser  = (int)$codUser;

		$ret = $db->sql("
			select *
			from `contas`
			where codUser='$codUser'
		");

		return $ret;
	}


	public function selConta($codUser, $codConta) {
		global $db;

		$codUser  = (int)$codUser;
		$codConta = (int)$codConta;

		$ret = $db->sql("
			select codigo
			from `contas`
			where codigo='$codConta'
			and codUser='$codUser'
			limit 1
		");

		if(!$ret['codigo']) {
			$this->errMsg = 'Não foi possível localizar a conta';
			$this->errObs = 'Não há nenhuma conta de código '. $codConta .' para seu usuário';
			return false;
		}

		$check = $db->connect(null, 'la_'. $codConta);
		if($check === false) {
			$this->errMsg = 'Erro ao selecionar a base da conta';
			$this->errObs = 'A base da conta informada não foi encontrada';
			return false;
		}

		return $ret['codigo'];
	}


	public function salvarConta($userCod, $contaNome='') {
		global $db;

		if(!(int)$userCod){
			$this->errMsg = 'Código não informado';
			$this->errObs = 'Não foi possível identificar o código do usuário';
			return false;
		}

		$hora = $db->sql("select now() as 'agora' limit 1");

		$db->sql("insert into `contas`", [
			'codUser' => $userCod,
			'nome'    => $contaNome,
			'dtCad'   => $hora['agora']
		]);

		$codConta = $db->getInsertId();

		$pega = $db->sql("
			select codigo, nome, dtCad, dtAcesso
			from `contas`
			where codigo='$codConta'
			limit 1
		");

		$check = $this->createDB($codConta);
		if($check === false) return false;

		$db->connect(null, '_sistema');

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
			CREATE TABLE `chat` (
				`codigo` INT(1) UNSIGNED NOT NULL AUTO_INCREMENT,
				`codUser` INT(1) UNSIGNED NOT NULL,
				`canal` VARCHAR(20) NOT NULL,
				`msg` VARCHAR(9999) NOT NULL,
				`dtCad` DATETIME NOT NULL,
				`ativo` TINYINT(1) UNSIGNED NOT NULL DEFAULT '1',
				PRIMARY KEY (`codigo`)
			)
			ENGINE = InnoDB;
		");

		$db->sql("
			CREATE TABLE `users` (
				`codigo` INT(1) UNSIGNED NOT NULL AUTO_INCREMENT,
				`nome` VARCHAR(100) NOT NULL,
				`apelido` VARCHAR(50) NOT NULL,
				`dtCad` DATETIME NOT NULL,
				`acesso` TINYINT(1) UNSIGNED NOT NULL DEFAULT '1',
				`ativo` TINYINT(1) UNSIGNED NOT NULL DEFAULT '1',
				PRIMARY KEY (`codigo`)
			)
			ENGINE = InnoDB;
		");

		R4::setSession('SELTABLE', 'la_'. $cod);
	}
}