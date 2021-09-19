<?php

session_start();

if(isset($_SERVER['HTTP_X_FORWARDED_PROTO'])) {
	$http = $_SERVER['HTTP_X_FORWARDED_PROTO'] .'://';
} else {
	$http = (isset($_SERVER['HTTPS'])) ? 'https://' : 'http://';
}

define('HTTP',       $http);

define('USER_IP',    ((isset($_SERVER['HTTP_X_FORWARDED_FOR']))
                     ? $_SERVER['HTTP_X_FORWARDED_FOR']
                     : $_SERVER['REMOTE_ADDR']));

define('ROOT_URL',   HTTP . $_SERVER['HTTP_HOST'] .'/');

define('ROOT',       '/var/www/html/');
define('R4PHP',      ROOT .'_assets/r4/php/');

define('SYSTEMID',   'lerio');
define('DEVMODE',    true);

define('SECRETKEY',  'As39Jsç2a²-aj12#%[8AZc a2!f"a57jh');

define('DBBASE',     'db'        );
define('DBUSER',     'sistema'   );
define('DBPASS',     'abisla'    );
define('INDEXTABLE', '_sistema'  );
define('DBTABLE',    (isset($_SESSION[SYSTEMID]['SELTABLE']))
                     ? $_SESSION[SYSTEMID]['SELTABLE']
                     : INDEXTABLE);