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
}
