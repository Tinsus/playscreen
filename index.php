<?php
$root = $_SERVER["DOCUMENT_ROOT"]."/playscreen/";

require_once($root."inc/.module.php");

$template = "index_player";

if (Server::IsServer()) {
	$template = "index_server";
}

$content = array(
);

$page = new Page("INDEX_PAGE_TITLE", $template);
$page->AddScript("index", false);
$page->Draw($content);
