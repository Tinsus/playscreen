<?php
$root = $_SERVER["DOCUMENT_ROOT"];

if ($_SERVER['HTTP_HOST'] == "localhost") {
	$root .= "/playscreen/";
} else {
	$root .= "/";
}

require_once($root."inc/.module.php");

switch(Param::Get("operation")) {
	case "language":
		Loca::SetLanguage(Param::Get("lang"));

		Page::SendJSON(true);

		break;
	default:
		Page::SendJSON(false);

		break;
}
