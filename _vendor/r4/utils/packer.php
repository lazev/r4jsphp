#!/usr/bin/php
<?php
require 'JSPacker.class.php';

$outfile = '../dist/r4.min.js';

file_put_contents($outfile, '');

echo navegar('../src/js/');

function navegar($dir) {

	$ignorar = [];

	$counter = 0;
	if(is_dir($dir)) {
		if(in_array($dir, $ignorar)) {
			echo 'Pasta ignorada: '. $dir ."\n";
		} else {
			if($handle = opendir($dir)) {
				while(false !== ($file = readdir($handle))) {
					if(($file != '.') && ($file != '..') && (!is_link($dir .'/'. $file))) {
						if(is_dir($dir .'/'. $file)) $counter += navegar($dir .'/'. $file);
						else if(substr($dir .'/'. $file, -3) == '.js') {
							if($file != 'autoload.js') $counter += ofuscar($dir .'/'. $file);
						}
					}
				}
			} else return false;
			closedir($handle);
		}
	} else {
		$counter += ofuscar($dir);
	}
	return $counter;
}


function ofuscar($arq) {
	global $outfile;
	
	$script = file_get_contents($arq);

	$packer = new JavaScriptPacker($script, 'Normal', true, false);
	$packed = $packer->pack();

	file_put_contents($outfile, $packed, FILE_APPEND);
	return 1;
}