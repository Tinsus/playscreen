<?php
$root = $_SERVER["DOCUMENT_ROOT"]."/playscreen/";

require_once($root."inc/.module.php");

switch(Param::Get("operation")) {
	case "wins":
		$db = DB::Save()->execute('
			SELECT
				playerdata, gamedata
			FROM
				savegames
			WHERE
				id = :id
			LIMIT
				1
		', array(
			":id" => Param::Get("id"),
		));

		$db = $db->fetch();

		$playerdata = unserialize($db["playerdata"]);
		$gamedata = unserialize($db["gamedata"]);

		$win = Param::Get("win");

		if (!array_key_exists("wins", $playerdata[$win])) {
			$playerdata[$win]["wins"] = 0;
		}

		$playerdata[$win]["wins"]++;

		$gamedata["currentQuestion"] = "";
		$gamedata["picks"] = array();

		$all["currentQuestion"] = $db["id"];

		DB::Save()->execute("
			UPDATE
				savegames
			SET
				playerdata = :playerdata,
				gamedata = :gamedata
			WHERE
				id = :id
		", array(
			":id" => Param::Get("id"),
			":gamedata" => serialize($gamedata),
			":playerdata" => serialize($playerdata),
		));

		Page::SendJSON($playerdata[$win]["wins"]);

		break;
	case "getPicks":
		$db = DB::Save()->execute('
			SELECT
				gamedata
			FROM
				savegames
			WHERE
				id = :id
			LIMIT
				1
		', array(
			":id" => Param::Get("id"),
		));

		$db = $db->fetch();

		$data = unserialize($db["gamedata"]);

		$picks = array();

		foreach ($data["picks"] as $k => $v) {
			$db = DB::Game()->execute('
				SELECT
					*
				FROM
					game2
				WHERE
					id IN ('.implode(",", array_filter($v)).')
			', array(
			));

			$picks[$k] = $db->fetchAll();
		}

		Page::SendJSON($picks);

		break;
	case "state":
		$db = DB::Save()->execute('
			SELECT
				*
			FROM
				savegames
			WHERE
				id = :id
			LIMIT
				1
		', array(
			":id" => Param::Get("id"),
		));

		$db = $db->fetch();

		if ($db["gamedata"] == NULL) {
			Page::SendJSON("newQuestion");
		}

		$db["gamedata"] = unserialize($db["gamedata"]);

		if (!array_key_exists("currentQuestion", $db["gamedata"]) or strlen($db["gamedata"]["currentQuestion"]) == 0) {
			Page::SendJSON("newQuestion");
		}

		$db["playerdata"] = unserialize($db["playerdata"]);

		foreach ($db["playerdata"] as $k => $v) {
			if (!array_key_exists("cards", $v)) {
				Page::SendJSON("getCards");
			}
		}

		if (array_key_exists("picks", $db["gamedata"]) or count($db["gamedata"]["picks"]) != 0) {
			if (count($db["gamedata"]["picks"]) == $db["numplayer"]) {
				Page::SendJSON("voteing");
			} else {
				Page::SendJSON("picking");
			}
		}

		Page::SendJSON(false);

		break;
	case "voteCard":
		$db = DB::Game()->execute('
			SELECT
				vote
			FROM
				game2
			WHERE
				id = :id
			LIMIT
				1
		', array(
			":id" => Param::Get("id"),
		));

		$db = $db->fetch();

		DB::Game()->execute("
			UPDATE
				game2
			SET
				vote = :vote
			WHERE
				id = :id
		", array(
			":id" => Param::Get("id"),
			":vote" => $db["vote"] + Param::Get("value"),
		));

		Page::SendJSON(true);

		break;
	case "newQuestion":
		$db = DB::Save()->execute('
			SELECT
				gamedata
			FROM
				savegames
			WHERE
				id = :id
			LIMIT
				1
		', array(
			":id" => Param::Get("id"),
		));

		$db = $db->fetch();
		$all = unserialize($db["gamedata"]);

		$db = DB::Game()->execute('
			SELECT
				id
			FROM
				game2
			WHERE
				pick != 0
				AND
				vote >= -5
			ORDER BY
				RAND()
			LIMIT
				1
		', array(
		));

		$db = $db->fetch();

		$all["currentQuestion"] = $db["id"];

		DB::Save()->execute("
			UPDATE
				savegames
			SET
				gamedata = :gamedata
			WHERE
				id = :id
		", array(
			":id" => Param::Get("id"),
			":gamedata" => serialize($all),
		));

		Page::SendJSON(true);

		break;
	case "getQuestion":
		$db = DB::Save()->execute('
			SELECT
				gamedata
			FROM
				savegames
			WHERE
				id = :id
			LIMIT
				1
		', array(
			":id" => Param::Get("id"),
		));

		$db = $db->fetch();
		$db = unserialize($db["gamedata"]);

		$db = DB::Game()->execute('
			SELECT
				*
			FROM
				game2
			WHERE
				id = :id
			LIMIT
				1
		', array(
			":id" => $db["currentQuestion"],
		));

		Page::SendJSON($db->fetch());

		break;
	case "trash":
		$db = DB::Save()->execute('
			SELECT
				playerdata
			FROM
				savegames
			WHERE
				id = :id
			LIMIT
				1
		', array(
			":id" => Param::Get("gameid"),
		));

		$db = $db->fetch();

		$all = unserialize($db["playerdata"]);

		$data = $all[Player::GetId(Param::Get("gameid"))];

		$new = array();

		foreach ($data["cards"] as $k => $v) {
			if ($v != Param::Get("id")) {
				$new[] = $v;
			}
		}

		$data["cards"] = $new;

		$all[Player::GetId(Param::Get("gameid"))] = $data;

		DB::Save()->execute("
			UPDATE
				savegames
			SET
				playerdata = :playerdata
			WHERE
				id = :id
		", array(
			":id" => Param::Get("gameid"),
			":playerdata" => serialize($all),
		));

		Page::SendJSON(count($data["cards"]));

		break;
	case "addCards":
		$db = DB::Save()->execute('
			SELECT
				playerdata
			FROM
				savegames
			WHERE
				id = :id
			LIMIT
				1
		', array(
			":id" => Param::Get("id"),
		));

		$db = $db->fetch();

		$all = unserialize($db["playerdata"]);

		$data = $all[Player::GetId(Param::Get("id"))];

		if (!array_key_exists("cards", $data)) {
			$data["cards"] = array();
		}

		$sum = 10 - count($data["cards"]);

		$db = DB::Game()->execute('
			SELECT
				id
			FROM
				game2
			WHERE
				pick = 0
				AND
				vote >= -5
			ORDER BY
				RAND()
			LIMIT
				'.$sum.'
		', array(
		));

		foreach ($db->fetchAll() as $k => $v) {
			$data["cards"][] = $v["id"];
		}

		$all[Player::GetId(Param::Get("id"))] = $data;

		DB::Save()->execute("
			UPDATE
				savegames
			SET
				playerdata = :playerdata
			WHERE
				id = :id
		", array(
			":id" => Param::Get("id"),
			":playerdata" => serialize($all),
		));

		Page::SendJSON(count($data["cards"]));

		break;
	case "ownCards":
		$db = DB::Save()->execute('
			SELECT
				playerdata
			FROM
				savegames
			WHERE
				id = :id
			LIMIT
				1
		', array(
			":id" => Param::Get("id"),
		));

		$db = $db->fetch();

		$all = unserialize($db["playerdata"]);

		$data = $all[Player::GetId(Param::Get("id"))];

		if (!array_key_exists("cards", $data) or count($data["cards"]) == 0) {
			Page::SendJSON(false);
		}

		$db = DB::Game()->execute('
			SELECT
				*
			FROM
				game2
			WHERE
				id IN ('.implode(",", $data["cards"]).')
		', array(
		));

		Page::SendJSON($db->fetchAll());

		break;
	case "submitPick":
		$pick = array(
			Param::Get("pick0"),
			Param::Get("pick1"),
			Param::Get("pick2"),
			Param::Get("pick3"),
			Param::Get("pick4"),
		);

		$db = DB::Save()->execute('
			SELECT
				playerdata, gamedata
			FROM
				savegames
			WHERE
				id = :id
			LIMIT
				1
		', array(
			":id" => Param::Get("id"),
		));

		$db = $db->fetch();

		$all = unserialize($db["playerdata"]);

		$data = $all[Player::GetId(Param::Get("id"))];

		$new = array();

		foreach ($data["cards"] as $k => $v) {
			if (!in_array($v, $pick)) {
				$new[] = $v;
			}
		}

		$data["cards"] = $new;

		$all[Player::GetId(Param::Get("id"))] = $data;

		$db = unserialize($db["gamedata"]);

		if (!array_key_exists("picks", $db)) {
			$db["picks"] = array();
		}

		$db["picks"][Player::GetId(Param::Get("id"))] = $pick;

		DB::Save()->execute("
			UPDATE
				savegames
			SET
				playerdata = :playerdata,
				gamedata = :gamedata
			WHERE
				id = :id
		", array(
			":id" => Param::Get("id"),
			":playerdata" => serialize($all),
			":gamedata" => serialize($db),
		));

		Page::SendJSON(count($data["cards"]));

		break;
}

require_once($root."ajax.php");
