<?php
class DB {
	private static $isSetup = false;
	private static $User;
	private static $Data;

	static function buildConnectionString($host = "", $db = "") {
		if ($host != "" && $db != "") {
			return "mysql:host=$host;dbname=$db;charset=utf8";
		} else {
			throw new PDOException("Can't build connection string, invalid parameters");
		}
	}

	static function setupConnections() {
		if (!DB::$isSetup) {
			try {
				DB::$User = new PDOEx(DB::buildConnectionString(MYSQL_HOST, MYSQL_DB1), MYSQL_USER1, MYSQL_PASS1, array(
					PDO::ATTR_PERSISTENT => true,
					PDO::ATTR_ERRMODE => PDO::ERRMODE_WARNING
				));
			} catch (PDOException $ex) {
				die("$ex FATAL ERROR: 1st database not accessible");
			}

			try {
				DB::$Data = new PDOEx(DB::buildConnectionString(MYSQL_HOST, MYSQL_DB2), MYSQL_USER2, MYSQL_PASS2, array(
					PDO::ATTR_PERSISTENT => true,
					PDO::ATTR_ERRMODE => PDO::ERRMODE_WARNING
				));
			} catch (PDOException $ex) {
				die("$ex FATAL ERROR: 2nd database not accessible");
			}

			DB::$isSetup = true;
		}
	}

	static function User() {
		if (!DB::$isSetup) {
			DB::setupConnections();
		}

		return DB::$User;
	}

	static function Data() {
		if (!DB::$isSetup) {
			DB::setupConnections();
		}

		return DB::$Data;
	}
}
