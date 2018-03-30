<?php
$root = $_SERVER["DOCUMENT_ROOT"]."/playscreen/";

require_once($root."inc/.module.php");

switch(Param::Get("operation")) {
	case "watchPlayers":
		Page::SendJSON($choosen);

		break;
}

require_once($root."ajax.php");
