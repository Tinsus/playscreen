<?php
class Server {
	public function Set($bool = true) {
		$_SESSION["server"] = $bool;
	}

	public function IsServer() {
		if (array_key_exists("server", $_SESSION)) {
			return $_SESSION["server"];
		}

		return false;
	}
}
