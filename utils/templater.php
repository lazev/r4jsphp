<?php

chdir(dirname(__FILE__) .'/../');

$rootFolder = './public/';

$headerFile = './src/_assets/templates/templates.html';

$headerCont = file_get_contents($headerFile);

$headerArr  = explode('<!--/R4TEMPLATE-->', $headerCont);

foreach($headerArr as $head) {

	$head = trim($head);

	if(!empty($head)) {

		preg_match_all('|\<!--R4TEMPLATE-(.*)--\>|', $head, $match);

		$version = $match[0][0];
		$head   .= PHP_EOL.'		<!--/R4TEMPLATE-->';

		searchAll($rootFolder, $version, $head);
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
		$filecont = str_replace($version, $head, $filecont);

		file_put_contents($filename, $filecont);
		
		//writeln($filename .': '. $version);
	}
}


function writeln($txt) {
	echo $txt .PHP_EOL;
}