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

$page = new Page("GAME_CUSTOM", "custom");
$page->AddScript("custom", false);
$page->AddScript("../game".$db["game"]."/player", false);
$page->Draw($content);
