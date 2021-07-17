<?php
class SignUp {

	public $errCod = 0;
	public $errMsg = '';
	public $errObs = '';


	public function validaCad($params=[]) {
		global $db;

		$user  = $params['user'];
		$pass  = $params['pass'];
		$pass2 = $params['pass2'];

		if(empty($user)) {
			$this->errMsg = 'E-mail inválido';
			$this->errObs = 'É necessário informar um e-mail válido';
			return false;
		}

		if((empty($pass)) || ($pass != $pass2)) {
			$this->errMsg = 'Senha inválida';
			$this->errObs = 'É necessário informar a senha de acesso duas vezes';
			return false;
		}

		$veri = $db->sql("
			select codigo from `usuarios`
			where user='$user'
			limit 1
		");

		if($veri['codigo']) {
			$this->errMsg = 'Usuário já cadastrado';
			$this->errObs = 'O e-mail informado já está em uso';
			$this->errCod = 10;
			return false;
		}

		return true;
	}


	public function cadastrar($params=[]) {
		global $db;

		$user  = $params['user'];
		$pass  = $params['pass'];
		$pass2 = $params['pass2'];

		if(!$this->validaCad($params)) {
			return false;
		}

		$hora = $db->sql("select now() as 'agora' limit 1");

		require_once '../login/login.class.php';
		$login = new Login;

		$cpass = $login->criptPass($pass);

		$dados = [
			'provider' => 'email',
			'user'     => $user,
			'pass'     => $cpass,
			'emails'   => $user,
			'dtCad'    => $hora['agora']
		];

		$db->sql("insert into `usuarios`", $dados);

		$cod = $db->getInsertId();

		$dados['codigo'] = $cod;

		$login->setLoginOk($dados);

		return [
			'cod'  => $cod,
			'user' => $user
		];

	}

}