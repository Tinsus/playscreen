<?php
ob_start();

$root = $_SERVER["DOCUMENT_ROOT"];

if ($_SERVER['HTTP_HOST'] == "localhost") {
	$root .= "/playscreen/";
} else {
	$root .= "/";
}

define ('MYSQL_HOST', '127.0.0.1');
// USER
define ('MYSQL_USER1', 'root');
define ('MYSQL_PASS1', '');
define ('MYSQL_DB1', 'playscreen_user');
// DATA
define ('MYSQL_USER2', 'root');
define ('MYSQL_PASS2', '');
define ('MYSQL_DB2', 'playscreen_data');

require_once("website/page.php");

require_once("website/pdoEx.php");
require_once("website/database.php");
require_once("website/sessionHelper.php");
require_once("website/errorHandling.php");
require_once("website/localization.php");

require_once("Rain/autoload.php");
require_once("Rain/RainTPL4.php");

require_once("website/param.php");
