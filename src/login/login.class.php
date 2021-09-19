<?php

class Login {

	private $privateKey = 'f8§32kf£fgs89f{²1%a2f8§32kf£fgs89f{²1%a2';

	public $errMsg = '';
	public $errObs = '';

	public function check($params) {
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

		$dados = $db->sql("
			select * from `usuarios`
			where user='$user'
			limit 1
		");

		if(!$dados || !$this->validPass($pass, $dados['pass'])) {
			$this->errMsg = 'Erro no login';
			$this->errObs = 'Usuário ou senha inválidos';
			return false;
		}

		if($dados['bloqueado']) {
			$this->errMsg = 'Conta bloqueada';
			$this->errObs = 'O acesso a esta conta foi bloqueado';
			return false;
		}

		return $this->setLoginOk($dados);
	}


	public function checkProvider($params) {
		global $db;

		$provider   = $params['provider'];
		$providerId = $params['providerId'];

		$dados = $db->sql("
			select * from `usuarios`
			where provider = '$provider'
			and providerId = '$providerId'
			limit 1
		");

		if(!$dados) {
			$this->errMsg = 'Erro no login';
			$this->errObs = 'Sua conta do '. ucfirst($provider) .' não possui acesso ao sistema.';
			return false;
		}

		if($dados['bloqueado']) {
			$this->errMsg = 'Conta bloqueada';
			$this->errObs = 'O acesso a esta conta foi bloqueado';
			return false;
		}

		return $this->setLoginOk($dados);
	}


	public function checkKeepLogged() {
		$cookie = isset($_COOKIE['keepMeLogged']) ? $_COOKIE['keepMeLogged'] : '';

		if(!$cookie) return false;

		list($random, $userCod, $token, $mac) = explode(':', $cookie);

		if(!hash_equals(
			hash_hmac('sha256', $random .':'. $userCod .':'. $token, SECRETKEY), $mac
		)) {
			return false;
		}

		$keepLogged = $this->getKeepLoggedTokenByUser((int)$userCod, (int)$random);

		if(!$keepLogged) return false;

		if(!hash_equals($keepLogged['token'], $token)) return false;

		$this->setKeepLoggedDtAcesso($keepLogged['codigo'], date('Y-m-d H:i:s'));

		return $this->setLoginOk(
			$this->getParamsByUserCod($userCod)
		);
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

			if(!isset($params['codigo']))     return false;
			if(!isset($params['user']))       $params['user']       = '';
			if(!isset($params['nome']))       $params['nome']       = '';
			if(!isset($params['provider']))   $params['provider']   = '';
			if(!isset($params['providerId'])) $params['providerId'] = '';

			R4::setSession('userLogged',     1);
			R4::setSession('userCod',        $params['codigo']);
			R4::setSession('userUser',       $params['user']);
			R4::setSession('userNome',       $params['nome']);
			R4::setSession('userProvider',   $params['provider']);
			R4::setSession('userProviderId', $params['providerId']);

			return $params['codigo'];
		}

		return false;
	}


	public function genKeepLogged($userCod) {
		global $db;

		$token  = bin2hex(random_bytes(128));
		$random = rand(100000, 999999);
		$cookie = $random .':'. $userCod .':'. $token;
		$mac    = hash_hmac('sha256', $cookie, SECRETKEY);

		if(!$mac) {
			$this->errMsg = 'Erro ao gerar o token de acesso';
			$this->errObs = 'Não foi possível salvar o acesso permanente';
			return false;
		}

		$db->sql("insert into `keepLogged`", [
			'codUser'  => $userCod,
			'random'   => $random,
			'token'    => $token,
			'dtAcesso' => date('Y-m-d H:i:s')
		]);

		$cookie .= ':' . $mac;

		setcookie('keepMeLogged', $cookie, time()+60*60*24*30, '/');

		return true;
	}


	public function criptPass($pass) {
		return password_hash($this->privateKey . $pass . $this->privateKey, PASSWORD_DEFAULT);
	}


	public function validPass($pass, $hash) {
		return password_verify($this->privateKey . $pass . $this->privateKey, $hash);
	}


	private function getParamsByUserCod($userCod) {
		global $db;

		$userCod = (int)$userCod;

		return $db->sql("
			select * from `usuarios`
			where codigo = $userCod
			limit 1
		");
	}


	private function getKeepLoggedTokenByUser($userCod, $random) {
		global $db;

		return $db->sql("
			select codigo, token from `keepLogged`
			where codUser = $userCod
			and random = $random
			limit 1
		");
	}


	private function setKeepLoggedDtAcesso($cod, $dtAcesso) {
		global $db;

		$db->sql("
			update `keepLogged`
			set dtAcesso = '$dtAcesso'
			where codigo = $cod
		");
	}
}