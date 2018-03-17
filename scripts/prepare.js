function prepareGame(game) {
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
		location.href=GetDomain() + "host.php?id=" + $("#id").html();

		AjaxLoading(false);
	}).fail(function(jqXHR, msg) {
		AjaxLoading(2);

		waitForPlayers();
	});
}
