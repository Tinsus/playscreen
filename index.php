<?php
$root = $_SERVER["DOCUMENT_ROOT"];

if ($_SERVER['HTTP_HOST'] == "localhost") {
	$root .= "/playscreen/";
} else {
	$root .= "/";
}

require_once($root."inc/.module.php");

$content = array(
);

$page = new Page("INDEX_PAGE_TITLE", "index");
$page->AddScript("index", false);
$page->Draw($content);
