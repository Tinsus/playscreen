<?php
$root = $_SERVER["DOCUMENT_ROOT"];

if ($_SERVER['HTTP_HOST'] == "localhost") {
	$root .= "/playscreen/";
} else {
	$root .= "/";
}

require_once($root."inc/.module.php");

if (!Page::IsLocal()) {
	Page::Reroute();
}

$content = array(
);

$page = new Page("GAME_PREPARE", "prepare");
$page->AddScript("prepare", false);
$page->Draw($content);
