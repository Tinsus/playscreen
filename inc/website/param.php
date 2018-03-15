<?php
class Param {
	static function Has($name) {
		if (array_key_exists($name, $_POST) or array_key_exists($name, $_GET)) {
			return true;
		} else {
			return false;
		}
	}

	static function Get($name) {
		if (array_key_exists($name, $_POST)) {
			if (is_array($_POST[$name])) {
				return $_POST[$name];
			} else {
				return trim($_POST[$name]);
			}
		} else if (array_key_exists($name, $_GET)) {
			if (is_array($_GET[$name])) {
				return $_GET[$name];
			} else {
				return trim($_GET[$name]);
			}
		}

		return false;
	}

	static function Check($name, $validator = "int") {
		$value = self::Get($name);

		switch (strtolower($validator)) {
			case "bool":
				$validator = FILTER_VALIDATE_BOOLEAN;
				break;
			case "mail":
			case "email":
				$validator = FILTER_VALIDATE_EMAIL;
				break;
			case "float":
				$validator = FILTER_VALIDATE_FLOAT;
				break;
			case "int":
				$validator = FILTER_VALIDATE_INT;

				if ($value == 0) {
					return true;
				}

				$value = (int) $value;

				break;
			case "ip":
				$validator = FILTER_VALIDATE_IP;
				break;
			case "regexp":
				$validator = FILTER_VALIDATE_REGEXP;
				break;
			case "url":
				$validator = FILTER_VALIDATE_URL;
				break;
			case "str":
			case "text":
				if ($value == (string) $value) {
					return true;
				}
		}

		return filter_var($value, $validator);
	}
}
