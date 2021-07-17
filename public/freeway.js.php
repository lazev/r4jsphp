<?php

$arr = [
	'rootURL' => 'https://'. $_SERVER['SERVER_NAME'] .'/'
];

echo 'const _CONFIG = '. json_encode($arr);