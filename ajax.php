<?php
$root = $_SERVER["DOCUMENT_ROOT"]."/playscreen/";

require_once($root."inc/.module.php");

switch(Param::Get("operation")) {
	case "language":
		Loca::SetLanguage(Param::Get("lang"));

		Page::SendJSON(true);

		break;
	case "getNewGame":
		Page::SendJSON(Game::Create(Param::Get("game")));

		break;
	case "getGame":
		$db = Game::Get(Param::Get("gameid"));

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
	case "joinGame":
		Player::JoinGame(Param::Get("gameid"));

		Page::SendJSON(true);

		break;
	case "waitForGame":
		$db = Game::Get(Param::Get("gameid"));

		Page::SendJSON(count($db["player"]) == $db["numplayer"]);

		break;
	case "countPlayers":
		Page::SendJSON(Game::CountPlayer(Param::Get("game")));

		break;
	case "startGameHosting":
		Game::StartHost(Param::Get("game"));

		Page::SendJSON(true);

		break;
	case "allChoosen":
		$db = DB::Save()->execute('
			SELECT
				player, playerdata
			FROM
				savegames
			WHERE
				id = :id
		', array(
			":id" => Param::Get("id"),
		));

		$db = $db->fetch();

		Page::SendJSON(count(unserialize($db["playerdata"])) == count(unserialize($db["player"])));

		break;
	case "startCountdown":
		DB::Save()->execute("
			UPDATE
				savegames
			SET
				settings = :settings
			WHERE
				id = :id
		", array(
			":id" => Param::Get("id"),
			":settings" => Param::Get("settings"),
		));

		Page::SendJSON(true);

		break;
	case "checkCountdown":
		$db = DB::Save()->execute("
			SELECT
				settings
			FROM
				savegames
			WHERE
				id = :id
		", array(
			":id" => Param::Get("id"),
		));

		$db = $db->fetch();

		Page::SendJSON($db["settings"]);

		break;
	default:
		Page::SendJSON(false);

		break;
}
