<?php

class Login {
	
	private $privateKey = 'f8§32kf£fgs89f{²1%a2f8§32kf£fgs89f{²1%a2';

	public $errMsg = '';
	public $errObs = '';

	public function checkLogin($params) {
		global $db;
		
		$user = $params['user'];
		$pass = $params['pass'];

		if(empty($user)) {
			$this->errMsg = 'Erro no login';
			$this->errObs = 'Informe seu e-mail';
			return false;
		}
		
		if(empty($pass)) {
			$this->errMsg = 'Erro no login';
			$this->errObs = 'Informe sua senha de acesso';
			return false;
		}
		
		$dados = $db->sql("select * from `usuarios` where user='$user' limit 1");
		
		if(!$this->validPass($pass, $dados['pass'])) {
			$this->errMsg = 'Erro no login';
			$this->errObs = 'Usuário ou senha inválidos';
			return false;
		}

		if($dados['bloqueado']) {
			$this->errMsg = 'Conta bloqueada';
			$this->errObs = 'O acesso a esta conta foi bloqueado';
			return false;
		}
		
		$this->setLoginOk($dados);
		
		return true;
	}

	
	public function setLoginOk($params) {
		global $db;
		
		if($params['codigo']) {
			$db->sql("
				update `usuarios`
				set dtAcesso=now()
				where codigo='". $params['codigo'] ."'
				limit 1
			");

			R4::setSession('userLogged', 1);
			R4::setSession('userCod',  $params['codigo']);
			R4::setSession('userUser', $params['user']);
			R4::setSession('userNome', $params['nome']);
			
			return true;
		}
	}
	

	public function criptPass($pass) {
		return password_hash($this->privateKey . $pass . $this->privateKey, PASSWORD_DEFAULT);
	}


	public function validPass($pass, $hash) {
		return password_verify($this->privateKey . $pass . $this->privateKey, $hash);
	}
}