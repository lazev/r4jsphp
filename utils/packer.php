<?php

chdir(dirname(__FILE__) .'/../');

require './utils/JSPacker.class.php';


//CSS R4
$content = implode(PHP_EOL, getFilesContent('./modules/r4/css', ['css']));
$content = removeCSSComments($content);
$content = removeSpaces($content);

file_put_contents('./public/_assets/r4/r4.min.css', $content);



//JS R4
$content = getFilesContent('./modules/r4/js', ['js']);

$result = '';
foreach($content as $cont) {
	$packer = new JavaScriptPacker($cont, 'Normal', true, false);
	$result .= $packer->pack();
}

file_put_contents('./public/_assets/r4/r4.min.js', $result);



//HTML PUBLIC
/*
Not working
require './utils/TinyHtmlMinifier.php';
$tinyHtmlMinifier = new TinyHtmlMinifier([
	'collapse_whitespace' => true,
	'disable_comments' => false,
]);

$content = [];
$content = getFilesContent('./public', ['htm', 'html']);

foreach($content as $file => $html) {
	echo $file;
	file_put_contents($file, $tinyHtmlMinifier->minify($html));
}
*/


function getFilesContent($dir, $ext) {
	$allContent = [];
	if($handle = opendir($dir)) {
		while(false !== ($file = readdir($handle))) {
			if(($file != '.') && ($file != '..') && (!is_link($dir .'/'. $file))) {
				if(!is_dir($dir .'/'. $file)) {
					if(in_array(pathinfo($dir .'/'. $file, PATHINFO_EXTENSION), $ext)) {
						$allContent[$dir .'/'. $file] = file_get_contents($dir .'/'. $file);
					}
				}
			}
		}
	}
	return $allContent;
}

function removeSpaces($string){
	$string = preg_replace("/\s{2,}/", " ", $string);
	$string = str_replace("\n", "", $string);
	$string = str_replace(', ', ",", $string);
	return $string;
}

function removeCSSComments($css){
	$file = preg_replace("/(\/\*[\w\'\s\r\n\*\+\,\"\-\.]*\*\/)/", "", $css);
	return $file;
}

