<?php

session_start();

define('SYSTEMID',  'lerio');

define('ROOT',      '/workspace/lerio/');
define('ROOT_URL',  'https://lerio-owoxm.run-us-west2.goorm.io/');

define('DBUSER',  'sistema'   );
define('DBPASS',  'abisla'    );
define('DBBASE',  'localhost' );
define('DBTABLE', (isset($_SESSION[SYSTEMID]['SELTABLE'])) ? $_SESSION[SYSTEMID]['SELTABLE'] : '_sistema');