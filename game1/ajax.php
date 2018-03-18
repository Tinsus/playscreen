<?php
$root = $_SERVER["DOCUMENT_ROOT"];

if ($_SERVER['HTTP_HOST'] == "localhost") {
	$root .= "/playscreen/";
} else {
	$root .= "/";
}

require_once($root."inc/.module.php");

switch(Param::Get("operation")) {
	case "watchColors":
		$db = DB::Save()->execute('
			SELECT
				playerdata
			FROM
				savegames
			WHERE
				id = :id
		', array(
			":id" => Param::Get("id"),
		));

		$db = $db->fetch();

		$choosen = array();

		if ($db["playerdata"] != NULL) {
			foreach (unserialize($db["playerdata"]) as $k => $v) {
				$choosen[] = $v["color"];
			}
		}

		Page::SendJSON($choosen);

		break;
	case "selectColor":
		$db = DB::Save()->execute('
			SELECT
				playerdata
			FROM
				savegames
			WHERE
				id = :id
		', array(
			":id" => Param::Get("id"),
		));

		$db = $db->fetch();

		if ($db["playerdata"] == NULL) {
			$db = array();
		} else {
			$db = unserialize($db["playerdata"]);
		}

		$db[] = array(
			"name" => Param::Get("name"),
			"color" => Param::Get("color"),
		);

		DB::Save()->execute("
			UPDATE
				savegames
			SET
				playerdata = :playerdata
			WHERE
				id = :id
		", array(
			":id" => Param::Get("id"),
			":playerdata" => serialize($db),
		));

		$_SESSION["game"] = Param::Get("id");
		$_SESSION["player"] = count($db);

		Page::SendJSON(true);

		break;
	default:
		Page::SendJSON(false);

		break;
}
