<?php

require_once '../config.inc.php';

$_SESSION[SYSTEMID] = [];

header('location: '. ROOT_URL .'login/');