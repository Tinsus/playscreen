<?php
class Player {
	static function JoinGame($id) {
		$db = Game::Get($id);
		$player = $db["player"];

		$date = new DateTime();

		$player[session_id()] = array(
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

		return array_search(session_id(), array_keys($db["player"]));
	}

	static function GetName($gameid) {
		$db = Game::Get($gameid);

		return $db[self::GetId($gameid)]["name"];
	}

	static function StillOnline($id) {
		$db = Game::Get($id);
		$date = new DateTime();

		$player = $db["player"];
		$player[session_id()][0] = $date->getTimestamp();

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
