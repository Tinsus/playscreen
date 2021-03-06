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
			) as $k => $v
		) {
			if (array_key_exists($k, $db)) {
				if (gettype($v) == "array") {
					$value = unserialize($db[$k]);

					if ($value == false) {
						$value = array();
					}

					$data[$k] = $value;
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

	static function SetAvatar($game, $name, $avatar) {
		$db = Game::Get($game);

		$data = $db["playerdata"];

		$data[] = array(
			"name" => $name,
			"tag" => $avatar,
		);

		DB::Save()->execute("
			UPDATE
				savegames
			SET
				playerdata = :playerdata
			WHERE
				id = :id
		", array(
			":id" => $game,
			":playerdata" => serialize($data),
		));

		$_SESSION["game"] = $game;

		return true;
	}

	static function ChangeAvatar($game, $name, $avatar) {
		$db = Game::Get($game);

		$player = $db["player"];
		$playerdata = $db["playerdata"];

		foreach ($playerdata as $k => $v) {
			if ($v["tag"] == $avatar) {
				$playerdata[$k]["name"] = $name;

				foreach ($player as $k2 => $v2) {
					if ($v2[0] == $k) {
						unset($player[$k2]);
					}
				}

				$now = new DateTime();

				$player[session_id()] = array(
					$now->getTimestamp(),
				);
			}
		}

		DB::Save()->execute("
			UPDATE
				savegames
			SET
				player = :player,
				playerdata = :playerdata
			WHERE
				id = :id
		", array(
			":id" => $game,
			":player" => serialize($player),
			":playerdata" => serialize($playerdata),
		));

		$_SESSION["game"] = $game;

		return true;
	}

	static function SetName($game, $name) {
		$db = Game::Get($game);

		$data = $db["settings"];

		$data["name"] = $name;

		DB::Save()->execute("
			UPDATE
				savegames
			SET
				settings = :settings
			WHERE
				id = :id
		", array(
			":id" => $game,
			":settings" => serialize($data),
		));

		return true;
	}

	static function IsReady($game) {
		$db = Game::Get($game);

		if (!Server::IsServer()) {
			Player::StillOnline($game);
		}

		return isset($db["settings"]["name"]) and $db["numplayer"] == count($db["playerdata"]) and self::StillOnline($game);
	}

	static function Saves($game) {
		$db = DB::Save()->execute('
			SELECT
				*
			FROM
				savegames
			WHERE
				game = :game
				AND
				numplayer > 0
			ORDER BY
				id DESC
		', array(
			":game" => $game,
		));

		$db = $db->fetchAll();

		if ($db === false) {
			return false;
		}

		$data = array();

		foreach ($db as $km => $vm) {
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
				) as $k => $v
			) {
				if (array_key_exists($k, $vm)) {
					if (gettype($v) == "array") {
						$value = unserialize($vm[$k]);

						if ($value == false) {
							$value = array();
						}

						$data[$km][$k] = $value;
					} else {
						$data[$km][$k] = $vm[$k];
					}
				} else {
					$data[$km][$k] = $v;
				}
			}
		}

		return $data;
	}

	static function StillOnline($id) {
		$db = self::Get($id);

		$now = new DateTime();
		$now = $now->getTimestamp();

		$player = $db["player"];

		foreach ($db["player"] as $k => $v) {
			if ($now - $v[0] >= 300) {
				unset($player[$k]);

				DB::Save()->execute("
					UPDATE
						savegames
					SET
						player = :player
					WHERE
						id = :id
				", array(
					":id" => $id,
					":player" => serialize($player),
				));
			}

			if ($now - $v[0] >= 120) {
				return false;
			}
		}

		return count($db["player"]) == $db["numplayer"];
	}
}
