<?php

class Painel {

	public $errMsg = '';
	public $errObs = '';

	public function salvarNome($idUser, $nome) {
		global $db;

		$idUser = (int)$idUser;

		if(!$idUser){
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
			where id = $idUser
			limit 1
		");

		$pega = $db->sql("
			select nome
			from `usuarios`
			where id = $idUser
			limit 1
		");

		return $pega;
	}


	public function listarContas($idUser) {
		global $db;

		$idUser  = (int)$idUser;

		$ret = $db->sql("
			select *
			from `contas`
			where idUser = $idUser
		");

		return $ret;
	}


	public function selConta($idUser, $idConta) {
		global $db;

		$idUser  = (int)$idUser;
		$idConta = (int)$idConta;

		$ret = $db->sql("
			select id
			from `contas`
			where id =  $idConta
			and idUser = $idUser
			limit 1
		");

		if(!$ret['id']) {
			$this->errMsg = 'Não foi possível localizar a conta';
			$this->errObs = 'Não há nenhuma conta de código '. $idConta .' para seu usuário';
			return false;
		}

		$check = $db->connect(null, 'la_'. $idConta);
		if($check === false) {
			$this->errMsg = 'Erro ao selecionar a base da conta';
			$this->errObs = 'A base da conta informada não foi encontrada';
			return false;
		}

		return $ret['id'];
	}


	public function salvarConta($idUser, $contaNome='') {
		global $db;

		if(!(int)$idUser){
			$this->errMsg = 'Código não informado';
			$this->errObs = 'Não foi possível identificar o código do usuário';
			return false;
		}

		$hora = $db->sql("select now() as 'agora' limit 1");

		$db->sql("insert into `contas`", [
			'idUser' => $idUser,
			'nome'   => $contaNome,
			'dtCad'  => $hora['agora']
		]);

		$idConta = $db->getInsertId();

		$pega = $db->sql("
			select id, nome, dtCad, dtAcesso
			from `contas`
			where id = $idConta
			limit 1
		");

		$check = $this->createDB($idConta);
		if($check === false) return false;

		$db->connect(null, '_sistema');

		if(empty($pega['nome'])) {

			$nome = 'Conta id #'. $idConta;

			$db->sql("
				update `usuarios`
				set nome = '$nome'
				where id = $idConta
				limit 1
			");

			$pega['nome'] = $nome;
		}

		return $pega;
	}


	private function createDB($id) {
		global $db;

		$id = (int)$id;
		if(!$id) {
			$this->errMsg = 'Cód da conta não informado';
			$this->errObs = 'Não foi possível criar a conta';
			return false;
		}

		$db->sql("create database `la_". $id ."` collate 'utf8mb4_general_ci';");

		if(!$db->connect(null, 'la_'. $id)) {
			$this->errMsg = 'Erro ao criar a conta';
			$this->errObs = $db->errCod .' - '. $db->errMsg;
			return false;
		}

		$db->sql("
			CREATE TABLE `chat` (
				`id` INT(1) UNSIGNED NOT NULL AUTO_INCREMENT,
				`idUser` INT(1) UNSIGNED NOT NULL,
				`canal` VARCHAR(20) NOT NULL,
				`msg` VARCHAR(9999) NOT NULL,
				`dtCad` DATETIME NOT NULL,
				`ativo` TINYINT(1) UNSIGNED NOT NULL DEFAULT '1',
				PRIMARY KEY (`id`)
			)
			ENGINE = InnoDB;
		");

		$db->sql("
			CREATE TABLE `users` (
				`id` INT(1) UNSIGNED NOT NULL AUTO_INCREMENT,
				`nome` VARCHAR(100) NOT NULL,
				`apelido` VARCHAR(50) NOT NULL,
				`dtCad` DATETIME NOT NULL,
				`acesso` TINYINT(1) UNSIGNED NOT NULL DEFAULT '1',
				`ativo` TINYINT(1) UNSIGNED NOT NULL DEFAULT '1',
				PRIMARY KEY (`id`)
			)
			ENGINE = InnoDB;
		");

		R4::setSession('SELTABLE', 'la_'. $id);
	}
}