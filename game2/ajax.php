<?php
$root = $_SERVER["DOCUMENT_ROOT"]."/playscreen/";

require_once($root."inc/.module.php");

function refreshCards($gameid) {
	$db = DB::Game()->execute("
		SELECT
			id
		FROM
			game2
		WHERE
			pick != 0
			AND
			vote >= -3
		ORDER BY
			RAND()
	", array(
	));

	$db = $db->fetchAll();

	$q = array();

	foreach ($db as $k => $v) {
		$q[] = (int) $v["id"];
	}

	$db = DB::Game()->execute("
		SELECT
			id
		FROM
			game2
		WHERE
			pick = 0
			AND
			vote >= -3
		ORDER BY
			RAND()
	", array(
	));

	$db = $db->fetchAll();

	$a = array();

	foreach ($db as $k => $v) {
		$a[] = (int) $v["id"];
	}

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
		":id" => $gameid,
	));

	$db = $db->fetch();
	$db = unserialize($db["gamedata"]);

	$db["q"] = $q;
	$db["a"] = $a;

	DB::Save()->execute("
		UPDATE
			savegames
		SET
			gamedata = :gamedata
		WHERE
			id = :id
	", array(
		":id" => $gameid,
		":gamedata" => serialize($db),
	));
}

switch(Param::Get("operation")) {
	case "addQuestion":
		$db = DB::Game();

		$data = $db->execute("
			INSERT INTO
				game2
				(text, box, pick)
			VALUES
				(:text, :box, :pick)
		", array(
			":text" => Param::Get("answer"),
			":box" => Player::GetName(Param::Get("id")),
			":pick" => Param::Get("pick"),
		));

		Page::SendJSON($db->lastInsertId());

		break;
	case "addAnswer":
		$db = DB::Game();

		$data = $db->execute("
			INSERT INTO
				game2
				(text, box)
			VALUES
				(:text, :box)
		", array(
			":text" => Param::Get("answer"),
			":box" => Player::GetName(Param::Get("id")),
		));

		$new = $db->lastInsertId();

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
		$all[Player::GetId(Param::Get("id"))]["cards"][] = $new;

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

		Page::SendJSON(count($all[Player::GetId(Param::Get("id"))]["cards"]));

		break;
	case "wins":
		$db = DB::Save()->execute('
			SELECT
				numplayer, playerdata, gamedata
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

		$gamedata["master"]++;

		if ($gamedata["master"] >= $db["numplayer"]) {
			$gamedata["master"] = 0;
		}

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

		if ((array_key_exists("picks", $db["gamedata"]) or count($db["gamedata"]["picks"]) != 0) and count($db["gamedata"]["picks"]) == $db["numplayer"] - 1) {
				Page::SendJSON("voteing");
		} else {
			if ($db["gamedata"]["master"] == Player::GetId(Param::Get("id"))) {
				Page::SendJSON("master");
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

		if (!array_key_exists("q", $all) or count($all["q"]) == 0) {
			refreshCards(Param::Get("id"));

			break;
		}

		$all["currentQuestion"] = array_shift($all["q"]);

		if (!array_key_exists("master", $all)) {
			$all["master"] = 0;
		}

		if ($all["currentQuestion"] == NULL) {
			refreshCards(Param::Get("id"));

			break;
		}

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

		Page::SendJSON(array(
			"q" => $db->fetch(),
		));

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
				gamedata, playerdata
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
		$data = unserialize($db["playerdata"]);

		if (!array_key_exists("a", $all) or count($all["a"]) == 0) {
			refreshCards(Param::Get("id"));

			break;
		}

		if (!array_key_exists("cards", $data[Player::GetId(Param::Get("id"))])) {
			$data[Player::GetId(Param::Get("id"))]["cards"] = array();
		}

		for ($i = 1; $i <= 10 - count($data[Player::GetId(Param::Get("id"))]["cards"]); $i++) {
			$data[Player::GetId(Param::Get("id"))]["cards"][] = array_shift($all["a"]);
		}

		DB::Save()->execute("
			UPDATE
				savegames
			SET
				gamedata = :gamedata,
				playerdata = :playerdata
			WHERE
				id = :id
		", array(
			":id" => Param::Get("id"),
			":gamedata" => serialize($all),
			":playerdata" => serialize($data),
		));

		Page::SendJSON(count($data[Player::GetId(Param::Get("id"))]["cards"]));

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

		if (!array_key_exists("cards", $all[Player::GetId(Param::Get("id"))]) or count($all[Player::GetId(Param::Get("id"))]["cards"]) == 0) {
			Page::SendJSON(false);
		}

		$db = DB::Game()->execute('
			SELECT
				*
			FROM
				game2
			WHERE
				id IN ('.implode(",", $all[Player::GetId(Param::Get("id"))]["cards"]).')
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
	case "onlineState":
		if (!Server::IsServer()) {
			Player::StillOnline(Param::Get("id"));
		}

		Page::SendJSON(Game::StillOnline(Param::Get("id")));

		break;
}

require_once($root."ajax.php");
