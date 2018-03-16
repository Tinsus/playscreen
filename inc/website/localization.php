<?php
class Loca {
	static function Get($key = "") {
		$lang = self::GetLanguage();

		if ($lang == "00") {
			return $key;
		}

		$db = DB::Save()->execute("
			SELECT
				id, de AS fallback, ".$lang." AS main
			FROM
				translation
			WHERE
				id = :id
		", array(
			":id" => $key,
		));

		$data = $db->fetch();

		if (isset($data["main"])) {
			return nl2br($data["main"]);
		} elseif (isset($data["fallback"])) {
			HandleErrors(9, "Loca fallback (".$lang."): ".$key, $_SERVER["SCRIPT_FILENAME"], 0);

			return nl2br($data["fallback"]);
		} else {
			HandleErrors(9, "Loca missing: ".$key, $_SERVER["SCRIPT_FILENAME"], 0);

			return $key;
		}
	}

	static function SetLanguage($langcode = "de") {
		switch ($langcode) {
			case "en":
			case "de":
			case "00":
				break;

			default:
				$langcode = "de";
				break;
		}

		$_SESSION['language'] = $langcode;
	}

	static function GetLanguage() {
		if (!array_key_exists("language", $_SESSION)) {
			$langcode = @$_SERVER['HTTP_ACCEPT_LANGUAGE'] or "DE";
			$langcode = explode(";", $langcode);
			$langcode = explode(",", $langcode['0']);
			$langcode = explode("-", $langcode['0']);
			$langcode = $langcode['0'];

			self::SetLanguage($langcode);
		}

		switch ($_SESSION['language']) {
			case "en":
			case "de":
			case "00":
				return $_SESSION['language'];

			default:
				return "de";
		}
	}

	static function SpecificScripts($page) {
		switch(self::GetLanguage()) {
			case "de":
				//$page->AddScript("keypad/jquery.keypad-de", false);
		}
	}
}
