<?php
$root = $_SERVER["DOCUMENT_ROOT"]."/playscreen/";

require_once($root."inc/.module.php");

switch(Param::Get("operation")) {
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
				*
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

		$all["currentQuestion"] = $db->fetch();

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

		if ($db === false) {
			Page::SendJSON(false);
		}

		$all = unserialize($db["gamedata"]);

		Page::SendJSON($all["currentQuestion"]);

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
				*
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
			$data["cards"][] = $v;
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

		if (!array_key_exists("cards", $data)) {
			Page::SendJSON(false);
		}

		Page::SendJSON($data["cards"]);

		break;
}

require_once($root."ajax.php");
