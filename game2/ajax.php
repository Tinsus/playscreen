<?php
$root = $_SERVER["DOCUMENT_ROOT"]."/playscreen/";

require_once($root."inc/.module.php");

switch(Param::Get("operation")) {
	case "newQuestion":
		//gameid is submitted as id (for box-selection or simmilar stuff)
		$db = DB::Game()->execute('
			SELECT
				*
			FROM
				game2
			WHERE
				pick != 0
				AND
				vote >= -5
			ORDER BY
				RAND()
			LIMIT
				1
		', array(
		));

		Page::SendJSON($db->fetch());

		break;
}

require_once($root."ajax.php");
