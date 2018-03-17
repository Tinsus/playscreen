function joinGame() {
	AjaxLoading(true);

	$.postJSON(GetDomain() + "ajax.php", {
		operation: "joinGame",
		gameid: $("#gameid").val(),
	}).done(function(json) {
		if (json == false) {
			$("#gameid").val("");
		} else {
			$("#joinGame").hide();

			$("#headline").html(json["name"]);

			$("#image").html(`
				<img src="` + GetDomain() + `game` + json["game"] + `/logo.svg" alt="game ` + json["game"] + ` logo" style="width: 90%; max-height: 200px;"/>
			`);

			$("#description").html(json["desc"]);

			$("#waitForGame").show();

			waitForGame(json["id"]);
		}

		AjaxLoading(false);
	}).fail(function(jqXHR, msg) {
		AjaxLoading(2);

		joinGame();
	});
}

function waitForGame(id) {
	$.postJSON(GetDomain() + "ajax.php", {
		operation: "waitForGame",
		gameid: id,
	}).done(function(json) {
		if (json == true) {
			location.href=GetDomain() + "play.php?id=" + id;
		}

		setTimeout("waitForGame(" + id + ")", 1000);
	}).fail(function(jqXHR, msg) {
		waitForGame(id);
	});
}
