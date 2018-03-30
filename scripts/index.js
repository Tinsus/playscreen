function getGame() {
	AjaxLoading(true);

	$.postJSON(GetDomain() + "ajax.php", {
		operation: "getGame",
		gameid: $("#gameid").val(),
	}).done(function(json) {
		if (json == false) {
			$("#gameid").val("");
		} else {
			$("#getGame").hide();

			$("#headline").html(json["name"]);

			$("#image").html(`
				<img src="` + GetDomain() + `game` + json["game"] + `/logo.svg" alt="game ` + json["game"] + ` logo" style="width: 90%; max-height: 200px;"/>
			`);

			$("#description").html(json["desc"]);

			$("#waitForGame").show();

			joinGame(json["id"]);
		}

		AjaxLoading(false);
	}).fail(function(jqXHR, msg) {
		AjaxLoading(2);

		getGame();
	});
}

function joinGame(id) {
	$.postJSON(GetDomain() + "ajax.php", {
		operation: "joinGame",
		gameid: id,
	}).done(function(json) {
		waitForGame(id);
	}).fail(function(jqXHR, msg) {
		joinGame(id);
	});
}

function waitForGame(id) {
	$.postJSON(GetDomain() + "ajax.php", {
		operation: "waitForGame",
		gameid: id,
	}).done(function(json) {
		if (json == true) {
			location.href = GetDomain() + "setup.php?id=" + id;
		}

		setTimeout("waitForGame(" + id + ")", 1000);
	}).fail(function(jqXHR, msg) {
		waitForGame(id);
	});
}

function prepareGame(game) {
	$("#main").hide();
	$(".gamedecs").hide();

	$("#prepare").fadeIn();

	$("#headline").html(GetLoca("GAME" + game));

	$("#image").html(`
		<img src="` + GetDomain() + `game` + game + `/logo.svg" alt="game ` + game + ` logo" style="width: 90%; max-height: 200px;"/>
	`);

	$("#description").html(GetLoca("GAME" + game + "_DESC"));

	switch(parseInt(game)) {
		case 1:
			$("#num").html(0);
			$("#total").html(4);
			break;
		default:
			$("#counter").html(GetLoca("GAME_UNKNOWN"));

			setTimeout("location.href='" + GetDomain() + "'", 5000);
			return;
	}

	if ($("#id").html().length == 0) {
		getNewGameID(game);
	}

	waitForPlayers();
}

function getNewGameID(game) {
	AjaxLoading(true);

	$.postJSON(GetDomain() + "ajax.php", {
		operation: "getNewGame",
		game: game,
	}).done(function(json) {
		$("#id").html(json);

		AjaxLoading(false);
	}).fail(function(jqXHR, msg) {
		AjaxLoading(2);

		getNewGameID(game);
	});
}

function waitForPlayers() {
	$.postJSON(GetDomain() + "ajax.php", {
		operation: "countPlayers",
		game: $("#id").html(),
	}).done(function(json) {
		$("#num").html(json);

		if (parseInt($("#num").html()) != 0) {
			$("#play").show();
		}

		if (parseInt($("#num").html()) >= parseInt($("#total").html())) {
			play();
		}

		setTimeout("waitForPlayers()", 1000);
	}).fail(function(jqXHR, msg) {
		waitForPlayers();
	});
}

function play() {
	AjaxLoading(true);

	$.postJSON(GetDomain() + "ajax.php", {
		operation: "startGameHosting",
		game: $("#id").html(),
	}).done(function(json) {
		location.href=GetDomain() + "setup.php?id=" + $("#id").html();

		AjaxLoading(false);
	}).fail(function(jqXHR, msg) {
		AjaxLoading(2);

		waitForPlayers();
	});
}
