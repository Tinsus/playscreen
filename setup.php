<?php
$root = $_SERVER["DOCUMENT_ROOT"]."/playscreen/";

require_once($root."inc/.module.php");

$db = DB::Save()->execute('
	SELECT
		*
	FROM
		savegames
	WHERE
		id = :id
', array(
	":id" => Param::Get("id"),
));

$db = $db->fetch();

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
