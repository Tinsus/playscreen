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

		$db = $db->fetch();

		DB::Game()->execute('
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

		Page::SendJSON($db);

		break;
	case "addCards":
		//gameid is submitted as id (for box-selection or simmilar stuff)
		$db = DB::Game()->execute('
			SELECT
				*
			FROM
				game2
			WHERE
				pick = 0
				AND
				vote >= -5
			ORDER BY
				RAND()
			LIMIT
				'.Param::Get("sum").'
		', array(
		));

		Page::SendJSON($db->fetchAll());

		break;
}

require_once($root."ajax.php");
