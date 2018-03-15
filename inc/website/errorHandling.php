<?php
function HandleErrors($errCode, $errMsg = "", $errFile = "", $errLine = "") {
	if (0 === error_reporting()) {
		return false;
	}

	if ($errCode == E_STRICT) {
		return true;
	}

	if ($errFile != "") {
		$errFile = pathinfo($errFile, PATHINFO_BASENAME);
	}

	$errType = "UNKNOWN";

	switch ($errCode) {
		case E_ERROR:
		case E_USER_ERROR:
			http_response_code(500);
			$errType = "ERROR";
			break;

		case E_WARNING:
		case E_USER_WARNING:
			$errType = "WARNING";
			break;

		case E_STRICT:
			$errType = "STRICT";
			break;

		case E_PARSE:
			$errType = "PARSE";
			break;

		case E_NOTICE:
		case E_USER_NOTICE:
			$errType = "NOTICE";
			break;

		case E_DEPRECATED:
		case E_USER_DEPRECATED:
			break;

		default:
			$errType = $errCode;
			break;
	}

	$query = DB::User()->execute("
        INSERT INTO
			errorlog
			(id, err_code, err_type, err_msg, err_file, err_line)
        VALUES
			(NULL, :errCode, :errType, :errMsg, :errFile, :errLine)
    ", array(
		":errCode" => $errCode,
		":errType" => $errType,
		":errMsg" => $errMsg,
		":errFile" => $errFile,
		":errLine" => $errLine,
	));

	if (@!Page::IsLocal()) {
		@sendmail(
			"fabian@terrarian.de",
			"Errorlog (".$errType."): ".$errFile,
			'<table><th><td>Type</td><td>Msg</td><td>File</td><td>Line</td></th><tr><td>'.$errType.'</td><td>'.$errMsg.'</td><td>'.$errFile.'</td><td>'.$errLine.'</td></tr></table>'
		);
	}

	return true;
}

set_error_handler("HandleErrors");

function HandleFatal() {
	$error = error_get_last();

	if ($error["type"] === E_CORE_ERROR || $error["type"] === E_ERROR) {
		ob_clean();

		if (strpos($error["message"], "Maximum execution time") !== false) {
			$uri = $_SERVER['REQUEST_URI'];
			$post = serialize($_POST);
			$get = serialize($_GET);
			$ip = $_SERVER['REMOTE_ADDR'];

			HandleErrors($error["type"], $error["message"]." <br><br> Site: <a href='http://".$_SERVER['HTTP_HOST']."/".$uri."'>".$uri."</a> <br> GET: ".$get." <br> POST: ".$post." <br><br> IP: ".$ip, $error["file"], $error["line"]);

			$timeout = 300;

			http_response_code(503);
			header('Retry-After: '.$timeout);

			die("Error 503: Service Unavailable - Try again in ".$timeout." seconds");
		} else {
			http_response_code(500);
			HandleErrors($error["type"], $error["message"], $error["file"], $error["line"]);

			if (!Page::IsLocal()) {
				Page::Reroute("io/error.php?e=500");
			}
		}
	}
}

register_shutdown_function("HandleFatal");

function HandleException($ex, $parentEx = null) {
	$childEx = $ex->getPrevious();

	if ($childEx != null) {
		HandleException($childEx, $ex);
	}

	if ($parentEx != null) {
		$message = "Child exception of ".get_class($parentEx).": ".$parentEx->getMessage()."\n".get_class($ex).": ".$ex->getMessage()."\nStacktrace:\n".$ex->getTraceAsString();
	} else {
		$message = get_class($ex).": ".$ex->getMessage()."\nStacktrace:\n".$ex->getTraceAsString();
	}

	DB::User()->execute("
        INSERT INTO
			errorlog
			(id, err_code, err_type, err_msg, err_file, err_line)
        VALUES
			(NULL, :errCode, :errType, :errMsg, :errFile, :errLine)
    ", array(
		":errCode" => $ex->getCode(),
		":errType" => get_class($ex),
		":errMsg" => $message,
		":errFile" => $ex->getFile(),
		":errLine" => $ex->getLine(),
	));

	if (!$parentEx) {
		ob_clean();

		http_response_code(500);

		Page::Reroute("io/error.php?e=500");
	}
}

set_exception_handler("HandleException");
