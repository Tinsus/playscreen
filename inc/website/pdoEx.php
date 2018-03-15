<?php
class PDOEx extends PDO  {
	function execute($query = "", array $input_parameters = array()) {
		$statement = $this->prepare($query);

		if (!$statement) {
			trigger_error("query is invalid", E_ERROR);
		} else {
			if (!$statement->execute($input_parameters)) {
				$errInfo = $statement->errorInfo();

				trigger_error($statement->queryString, E_USER_NOTICE);
				trigger_error("query failed for the following reason: \n".$errInfo[2], E_USER_ERROR);
			}
		}

		return $statement;
	}
}
