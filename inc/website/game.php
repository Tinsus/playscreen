<?php
class Game {
	static function Create($game) {
		$db = DB::Save();

		$data = $db->execute("
			INSERT INTO
				savegames
				(id, game)
			VALUES
				(NULL, :game)
		", array(
			":game" => $game,
		));

		return $db->lastInsertId();
	}

	static function Get($game) {
		$db = DB::Save()->execute('
			SELECT
				*
			FROM
				savegames
			WHERE
				id = :id
		', array(
			":id" => $game,
		));

		$db = $db->fetch();

		if ($db === false) {
			return false;
		}

		$data = array();

		foreach (
		array(
			"id" => 0,
			"time" => 0,
			"game" => 0,
			"numplayer" => -1,
			"player" => array(),
			"playerdata" => array(),
			"gamedata" => array(),
			"settings" => array(),
		) as $k => $v) {
			if (array_key_exists($k, $db)) {
				if (gettype($v) == "array") {
					$data[$k] = unserialize($db[$k]);
				} else {
					$data[$k] = $db[$k];
				}
			} else {
				$data[$k] = $v;
			}
		}

		return $data;
	}

	static function CountPlayer($game) {
		$db = self::Get($game);

		return count($db["player"]);
	}

	static function StartHost($game) {
		$db = self::Get($game);

		DB::Save()->execute("
			UPDATE
				savegames
			SET
				numplayer = :numplayer
			WHERE
				id = :id
		", array(
			":id" => Param::Get("game"),
			":numplayer" => count($db["player"]),
		));

		return true;
	}
}
