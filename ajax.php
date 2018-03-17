<?php
$root = $_SERVER["DOCUMENT_ROOT"];

if ($_SERVER['HTTP_HOST'] == "localhost") {
	$root .= "/playscreen/";
} else {
	$root .= "/";
}

require_once($root."inc/.module.php");

switch(Param::Get("operation")) {
	case "language":
		Loca::SetLanguage(Param::Get("lang"));

		Page::SendJSON(true);

		break;
	case "getNewGame":
		DB::Save()->execute("
			INSERT INTO
				savegames
				(id, game)
			VALUES
				(NULL, :game)
		", array(
			":game" => Param::Get("game"),
		));

		$db = DB::Save()->execute('
			SELECT
				id
			FROM
				savegames
			WHERE
				game = :game
			ORDER BY
				time DESC
			LIMIT
				1
		', array(
			":game" => Param::Get("game"),
		));

		$db = $db->fetch();

		Page::SendJSON($db["id"]);

		break;
	case "joinGame":
		$db = DB::Save()->execute('
			SELECT
				game
			FROM
				savegames
			WHERE
				id = :id
		', array(
			":id" => Param::Get("gameid"),
		));

		$db = $db->fetch();

		if (!$db == false) {
			Page::SendJSON(array(
				"id" => Param::Get("gameid"),
				"game" => $db["game"],
				"name" => Loca::Get("GAME".$db["game"]),
				"desc" => Loca::Get("GAME".$db["game"]."_DESC"),
			));
		} else {
			Page::SendJSON(false);
		}

		break;
	case "waitForGame":
		$db = DB::Save()->execute('
			SELECT
				numplayer, player
			FROM
				savegames
			WHERE
				id = :id
		', array(
			":id" => Param::Get("gameid"),
		));

		$db = $db->fetch();

		if ($db["player"] == NULL) {
			$player = array();
		} else {
			$numplayer = $db["numplayer"];
			$player = unserialize($db["player"]);
		}

		if ($numplayer == NULL) {
			$numplayer = 1000;
		}

		$player[] = session_id();

		$player = array_unique($player);

		DB::Save()->execute("
			UPDATE
				savegames
			SET
				player = :player
			WHERE
				id = :id
		", array(
			":id" => Param::Get("gameid"),
			":player" => serialize($player),
		));

		if (count($player) >= $numplayer) {
			Page::SendJSON(true);
		} else {
			Page::SendJSON(false);
		}

		break;
	case "countPlayers":
		$db = DB::Save()->execute('
			SELECT
				player
			FROM
				savegames
			WHERE
				id = :id
		', array(
			":id" => Param::Get("game"),
		));

		$db = $db->fetch();

		if ($db["player"] == NULL) {
			Page::SendJSON(0);
		} else {
			Page::SendJSON(count(unserialize($db["player"])));
		}

		break;
	case "startGameHosting":
		$db = DB::Save()->execute('
			SELECT
				player
			FROM
				savegames
			WHERE
				id = :id
		', array(
			":id" => Param::Get("game"),
		));

		$db = $db->fetch();

		DB::Save()->execute("
			UPDATE
				savegames
			SET
				numplayer = :numplayer
			WHERE
				id = :id
		", array(
			":id" => Param::Get("game"),
			":numplayer" => count(unserialize($db["player"])),
		));

		Page::SendJSON(true);

		break;
	default:
		Page::SendJSON(false);

		break;
}
