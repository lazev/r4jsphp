<?php

require_once 'config.inc.php';

if((!isset($_SESSION[SYSTEMID])) || (!$_SESSION[SYSTEMID]['userLogged'])) {
	echo 'window.location = "'. ROOT_URL .'login/";';
} else {
	require_once 'freeway.js.php';
}