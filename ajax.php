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
	case "getGameData":
		Page::SendJSON(Game::Get(Param::Get("id")));

		break;
	case "selectAvatar":
		Game::SetAvatar(Param::Get("id"), Param::Get("name"), Param::Get("avatar"));

		Page::SendJSON(true);

		break;
	case "checkCountdown":
		Page::SendJSON(Game::IsReady(Param::Get("id")));

		break;
	case "gameName":
		Game::SetName(Param::Get("id"), Param::Get("name"));

		Page::SendJSON(true);

		break;
	default:
		Page::SendJSON(false);

		break;
}
