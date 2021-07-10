<?php

class R4 {

	public static function retOkAPI($params=[]) {
		$params['ok'] = 1;
		echo json_encode($params);
	}

	public static function dieAPI($stat=0, $msg='', $obs='') {
		echo '{"error": 1, "status": "'. $stat .'", "errMsg": "'. $msg .'", "errObs": "'. $obs .'"}';
		require 'r4iniend.php';
		die();
	}

	public static function setSession($index, $val) {
		$_SESSION[SYSTEMID][$index] = $val;
		return true;
	}

	public static function getSession($index) {
		if(!isset($_SESSION[SYSTEMID][$index])) return null;
		return $_SESSION[SYSTEMID][$index];
	}
	
	public static function intArray($val) {
		if(is_array($val)) {
			$arr = $val;
		} else {
			if(strpos($val, ',') !== false) {
				$arr = explode(',', $val);
			} else {
				$arr = [$val];
			}
		}
	
		foreach($arr as $item) {
			$ret[] = (int)$item;
		}
		
		return $ret;
	}
}