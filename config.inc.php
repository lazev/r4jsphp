<?php

session_start();

define('SYSTEMID',  'lara');

define('ROOT',      '/workspace/lara/');
define('ROOT_URL',  'https://lara-stlgm.run-us-west2.goorm.io/');

define('DBUSER',  'sistema'   );
define('DBPASS',  'abisla'    );
define('DBBASE',  'localhost' );
define('DBTABLE', (isset($_SESSION[SYSTEMID]['SELTABLE'])) ? $_SESSION[SYSTEMID]['SELTABLE'] : '_sistema');