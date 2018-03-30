<?php
class Server {
	static function Set($bool = true) {
		$_SESSION["server"] = $bool;
	}

	static function IsServer() {
		if (array_key_exists("server", $_SESSION)) {
			return $_SESSION["server"];
		}

		return false;
	}
}
