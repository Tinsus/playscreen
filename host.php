<?php
$root = $_SERVER["DOCUMENT_ROOT"];

if ($_SERVER['HTTP_HOST'] == "localhost") {
	$root .= "/playscreen/";
} else {
	$root .= "/";
}

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

$page = new Page("GAME_HOST", "host");
$page->AddScript("snapsvg/snap.svg", true);
$page->AddScript("host", false);
$page->AddScript("../game".$db["game"]."/game", false);
$page->Draw($content);
