<?php

session_start();

if(isset($_SERVER['HTTP_X_FORWARDED_PROTO'])) {
	$http = $_SERVER['HTTP_X_FORWARDED_PROTO'] .'://';
} else {
	$http = (isset($_SERVER['HTTPS'])) ? 'https://' : 'http://';
}

//Force https
$http = 'https://';


define('HTTP',       $http);

define('USER_IP',    ((isset($_SERVER['HTTP_X_FORWARDED_FOR']))
                     ? $_SERVER['HTTP_X_FORWARDED_FOR']
                     : $_SERVER['REMOTE_ADDR']));

define('ROOT_URL',   HTTP . $_SERVER['HTTP_HOST'] .'/');

define('ROOT',       pathinfo(__FILE__)['dirname'] .'/');

define('R4PHP',      ROOT .'_assets/r4/php/');

define('SYSTEMID',   'lerio');
define('DEVMODE',    true);

define('SECRETKEY',  'As39Jsç2a²-aj12#%[8AZc a2!f"a57jh');

define('INDEXDB',       'localhost' );
define('INDEXTABLE',    '_sistema'  );
define('NEWACCOUNTSDB', 'localhost');
define('DBUSER',        'sistema'   );
define('DBPASS',        'abisla'    );
define('DBTABLE',       (isset($_SESSION[SYSTEMID]['SELTABLE']))
                        ? $_SESSION[SYSTEMID]['SELTABLE']
                        : INDEXTABLE);
