<?php
require_once 'config.inc.php';

$arr = [
	'rootURL' => HTTP .'://'. $_SERVER['SERVER_NAME'] .'/'
];

echo 'const _CONFIG = '. json_encode($arr);