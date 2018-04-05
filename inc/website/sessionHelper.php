<?php
class MySessionHandler implements SessionHandlerInterface {
	public function open($savePath, $sessionName) {
		session_set_cookie_params(
			60 * 60 * 24 * 30,
			"/",
			$_SERVER['HTTP_HOST'],
			$_SERVER['HTTP_HOST'] != "localhost",
			true
		);

		return true;
	}

	public function close() {
		return true;
	}

	public function read($id) {
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

		if ($row === false) {
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

		return $db !== false;
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

		return $db !== false;
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

		return $db !== false;
	}
}

ini_set('session.gc_probability', 1);
ini_set('session.gc_divisor', 100);
ini_set('session.gc_maxlifetime', 60 * 60 * 24 * 30);

$handler = new MySessionHandler();
session_set_save_handler($handler, true);

session_start();
