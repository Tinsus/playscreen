<?php
$root = $_SERVER["DOCUMENT_ROOT"];

if ($_SERVER['HTTP_HOST'] == "localhost") {
	$root .= "/playscreen/";
} else {
	$root .= "/";
}

Rain\Tpl::configure(array(
	'cache_dir'		=> $root.'tmp/',
	'tpl_dir'		=> $root.'tpl/',
	'auto_escape'	=> false,
	'debug'			=> true,
));
