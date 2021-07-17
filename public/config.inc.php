<?php

session_start();

define('SYSTEMID', 'lerio');

define('ROOT',     '/workspace/lerio/public/');
define('ROOT_URL', 'https://lerio-owoxm.run-us-west2.goorm.io/');
define('R4PHP',    ROOT.'_assets/r4/php/');

define('DEVMODE', true);

define('DBUSER',     'sistema'   );
define('DBPASS',     'abisla'    );
define('DBBASE',     'localhost' );
define('INDEXTABLE', '_sistema'  );
define('DBTABLE', (isset($_SESSION[SYSTEMID]['SELTABLE'])) ? $_SESSION[SYSTEMID]['SELTABLE'] : INDEXTABLE);