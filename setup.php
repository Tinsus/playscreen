<?php
$root = $_SERVER["DOCUMENT_ROOT"]."/playscreen/";

require_once($root."inc/.module.php");

$db = Game::Get(Param::Get("id"));

$content = array(
	"game" => $db,
);

$template = "setup_player";

if (Server::IsServer()) {
	$template = "setup_server";
}

$page = new Page("GAME_SETUP", $template);
$page->AddScript("setup", false);
$page->AddScript("../game".$db["game"]."/setup", false);
$page->Draw($content);
