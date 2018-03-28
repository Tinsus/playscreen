<?php
$root = $_SERVER["DOCUMENT_ROOT"]."/playscreen/";

require_once($root."inc/.module.php");

if (true /*is server*/) {
	Page::Reroute();
}

$content = array(
);

$page = new Page("GAME_PREPARE", "prepare");
$page->AddScript("prepare", false);
$page->Draw($content);
