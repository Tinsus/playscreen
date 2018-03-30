<?php
$root = $_SERVER["DOCUMENT_ROOT"]."/playscreen/";

require_once($root."inc/.module.php");

$db = Game::Get(Param::Get("id"));

$content = array(
	"game" => $db,
);

$template = "play_player";

if (Server::IsServer()) {
	$template = "play_server";
}

$page = new Page("GAME_PLAY", $template);
$page->AddScript("snapsvg/snap.svg", true);
$page->AddScript("play", false);
$page->AddScript("../game".$db["game"]."/game", false);
$page->Draw($content);
