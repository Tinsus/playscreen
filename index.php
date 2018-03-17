<?php
$root = $_SERVER["DOCUMENT_ROOT"];

if ($_SERVER['HTTP_HOST'] == "localhost") {
	$root .= "/playscreen/";
} else {
	$root .= "/";
}

require_once($root."inc/.module.php");

$template = "index_server";

if (!Page::IsLocal() or Param::Has("player")) {
	$template = "index_player";
}

$page = new Page("INDEX_PAGE_TITLE", $template);
$page->AddScript("index", false);
$page->Draw($content);
