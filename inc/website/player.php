<?php
class Player {
	static function JoinGame($id) {
		$db = Game::Get($id);

		$player = array();

		if ($db !== false and $db["player"] != NULL) {
			$player = $db["player"];
		}

		$date = new DateTime();

		$player[session_id()] = array(
			count($player),
			$date->getTimestamp(),
		);

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

	static function GetId($gameid) {
		$db = Game::Get($gameid);

		return $db["player"][session_id()][0];
	}

	static function GetName($gameid) {
		$db = Game::Get($gameid);

		return $db[self::GetId($gameid)]["name"];
	}

	static function StillOnline($id) {
		$db = Game::Get($id);
		$date = new DateTime();

		$player = $db["player"];
		$player[session_id()][1] = $date->getTimestamp();

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
}
