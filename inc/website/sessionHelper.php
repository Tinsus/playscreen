<?php
class MySessionHandler implements SessionHandlerInterface {
	public function open($savePath, $sessionName) {
		return true;
	}

	public function close() {
		return true;
	}

	public function read($id, $override = false) {
		if (!$override and array_key_exists("SessionAuth", $_COOKIE) and $_COOKIE["SessionAuth"] != session_id()) {
			self::write(session_id(), self::read($_COOKIE["SessionAuth"], true));
			self::Destroy($_COOKIE["SessionAuth"]);

			return self::read($_COOKIE["SessionAuth"], true);
		}

		$db = DB::Save()->execute("
			SELECT
				value
			FROM
				sessions
			WHERE
				id = :id
		", array(
			":id" => $id,
		));

		$row = $db->fetch();

		setcookie("SessionAuth", session_id(), 60 * 60 * 24 * 30 + time(), "/", $_SERVER['HTTP_HOST'], $_SERVER['HTTP_HOST'] != "localhost", true);

		if (!is_array($row)) {
			return "";
		} else {
			return $row["value"];
		}
	}

	public function write($id, $data) {
		$db = DB::Save()->execute("
			REPLACE INTO
				sessions
				(id, value)
			VALUES
				(:id, :data)
		", array(
			":id" => $id,
			":data" => $data,
		));

		return (bool) $db;
	}

	public function destroy($id) {
		$db = DB::Save()->execute("
			DELETE FROM
				sessions
			WHERE
				id = :id
		", array(
			":id" => $id,
		));

		return (bool) $db;
	}

	public function gc($lifeTime) {
		foreach (glob(Page::GetRoot()."pdf/*.pdf") as $filename) {
			unlink($filename);
		}

		$db = DB::Save()->execute("
			DELETE FROM
				sessions
			WHERE
				TIMEDIFF(CURRENT_TIMESTAMP(), `time`) >= :lifeTime
		", array(
			":lifeTime" => date("H:i:s", $lifeTime),
		));

		return (bool) $db;
	}
}

$handler = new MySessionHandler();
ini_set('session.gc_probability', 1);
ini_set('session.gc_divisor', 100);
ini_set('session.gc_maxlifetime', 60 * 60 * 24 * 30);
session_set_cookie_params(60 * 60 * 24 * 30 , "/", $_SERVER['HTTP_HOST'], $_SERVER['HTTP_HOST'] != "localhost", true);
session_set_save_handler($handler, true);
session_name("Session");

session_start();
