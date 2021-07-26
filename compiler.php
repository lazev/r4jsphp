#!/usr/bin/php
<?php

chdir(dirname(__FILE__));

$monitorFolders = [
	'./src', './modules/r4'
];

$past = ''; //getlshash();

if(isset($argv) && $argv[1] == 'monitor') {

	echo PHP_EOL .'Monitor hash: '. $past .PHP_EOL;
	echo 'Monitoring...'. PHP_EOL;

	while(true) {
		$ls = getlshash();
		if($past != $ls) {
			echo PHP_EOL .'Monitor hash: '. $ls .PHP_EOL;
			compile();
			$past = getlshash();
			echo 'Monitoring...'. PHP_EOL;
		} else {
			$past = $ls;
		}
		sleep(2);
	}
} else {
	echo PHP_EOL .'Single project update...'. PHP_EOL;
	compile();
}


function getlshash() {
	global $monitorFolders;

	foreach($monitorFolders as $folder) {
		$lsarr[] = trim(shell_exec('ls -Rtral '. $folder .' | md5sum'));
	}

	return implode('', $lsarr);
}


function compile() {
	echo date('d/m/Y H:i:s') .' Updating codes...'. PHP_EOL;
	shell_exec('rm -rf ./public/*');
//	shell_exec('mkdir ./public');
	shell_exec('cp -r ./src/* ./public/');
	shell_exec('mkdir ./public/_assets/r4');
	shell_exec('cp -r ./modules/r4/php ./public/_assets/r4/');
//	shell_exec('chown -R www-data. ./public');
	shell_exec('php utils/templater.php');
	shell_exec('php utils/packer.php');
	echo date('d/m/Y H:i:s') .' Ok'. PHP_EOL;
}