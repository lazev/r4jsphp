<?php

session_start();

define('SYSTEMID', 'lerio');
define('HTTP',     'http');
define('ROOT',     '/var/www/html/');
define('ROOT_URL', HTTP.'://dev.local/');
define('R4PHP',    ROOT.'_assets/r4/php/');

define('DEVMODE', true);

define('DBUSER',     'sistema'   );
define('DBPASS',     'abisla'    );
define('DBBASE',     'db' );
define('INDEXTABLE', '_sistema'  );
define('DBTABLE', (isset($_SESSION[SYSTEMID]['SELTABLE'])) ? $_SESSION[SYSTEMID]['SELTABLE'] : INDEXTABLE);