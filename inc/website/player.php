<?php
class Player {
	static function JoinGame($id) {
		$db = Game::Get($id);

		$player = array();

		if ($db !== false and $db["player"] != NULL) {
			$player = $db["player"];
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
			":id" => $id,
			":player" => serialize($player),
		));
	}

	static function GetId($gameid) {
		$db = DB::Save()->execute('
			SELECT
				player
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

		return array_search(session_id(), unserialize($db["player"]));
	}
}
