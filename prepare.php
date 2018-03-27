<?php
$root = $_SERVER["DOCUMENT_ROOT"]."/playscreen/";

require_once($root."inc/.module.php");

if (!Page::IsLocal()) {
	Page::Reroute();
}

$content = array(
);

$page = new Page("GAME_PREPARE", "prepare");
$page->AddScript("prepare", false);
$page->Draw($content);
