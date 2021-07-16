#!/usr/bin/php
<?php

chdir(dirname(__FILE__));

$headerFile = './_assets/templates/templates.html';

chdir('../../../');

$headerCont = file_get_contents($headerFile);

$headerArr  = explode('<!--/R4TEMPLATE-->', $headerCont);

foreach($headerArr as $head) {

	$head = trim($head);

	if(!empty($head)) {

		preg_match_all('|\<!--R4TEMPLATE-(.*)--\>|', $head, $match);

		$version = $match[0][0];
		$head   .= PHP_EOL.'		<!--/R4TEMPLATE-->';

		searchAll('./', $version, $head);
	}
}

function searchAll($rootFolder, $version, $head) {
	global $headerFile;
	
	$arrFiles = scandir($rootFolder);
		
	foreach($arrFiles as $file) {
		if(substr($file, 0, 1) == '.') continue;
		if($rootFolder . $file == $headerFile) continue;

		if(is_dir($rootFolder . $file)) {
			searchAll($rootFolder . $file .'/', $version, $head);
		} else {
					
			if((substr($rootFolder . $file, -4) == 'html') || (substr($rootFolder . $file, -3) == 'htm')) {
				replacer($rootFolder . $file, $version, $head);
			}
		}
	}
}

function replacer($filename, $version, $head) {

	if($version) {
		$filecont = file_get_contents($filename);

		//$filecont = preg_replace('/'.$version.'(.*)<!--\/R4TEMPLATE-->/si', $head, $filecont, null, $conta);

		preg_match('/'.$version.'(.*)<!--\/R4TEMPLATE-->/si', $filecont, $match);

		if($match) {
			writeln('******************');
			writeln($filename);
			writeln('/'.$version.'(.*)<!--\/R4TEMPLATE-->/si');
			writeln($match[0]);
			$filecont = str_replace($match[0], $head, $filecont);
		}

		file_put_contents($filename, $filecont);
	}
}


function writeln($txt) {
	echo $txt .PHP_EOL;
}