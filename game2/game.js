function setupGame() {
	if (IsServer()) {
		AjaxLoading(true);

		$("#game").addClass("w3-container");

		$("#game").html(`
			<table class="w3-table-all">
				<tr>
					<th>
						Spieler:
					</th>
					<th>
						Punkte:
					</th>
				</tr>
			</table>
			<div id="question" class="w3-container w3-padding">
				Frage
			</div>
			<div id="answers" class="w3-container w3-padding">
				Antworten
			</div>
		`);

		$.postJSON(GetDomain() + "ajax.php", {
			operation: "getGameData",
			id: getUrlVar("id"),
		}).done(function(json) {

			$.each(json.playerdata, function(k, v) {
				$("#game table").append(`
					<tr>
						<td class="w3-text-` + v.tag + `">
							` + v.name + `
						</td>
						<td id="points">
							0
						</td>
					</tr>
				`);
			});

			AjaxLoading(false);

			newQuestion();
		}).fail(function(jqXHR, msg) {
			AjaxLoading(2);

			setupGame();
		});
	} else {
		$("#game").addClass("w3-container");

		$("#game").html(`
			<div class="w3-container w3-responsive" style="height: 100%">
				<table class="w3-table-all">
					<tr id="cards">
					</tr>
				</table>

			</div>
		`);

		playerAddCards();
	}
}

function newQuestion() {
	$.postJSON(GetDomain() + "game2/ajax.php", {
		operation: "newQuestion",
		id: getUrlVar("id"),
	}).done(function(json) {
		console.log(json);

		$("#question").html(`
			<div class="w3-third">
				&nbsp;
			</div>
			<div class="w3-third w3-card w3-black w3-container w3-xlarge">
				<p style="min-height: 250px">
					` + json["text"] + `
				</p>
				<p class="w3-tiny w3-text-grey">
					` + json["id"] + `
					` + json["box"] + `
					` + json["vote"] + `
					<b class="w3-right w3-medium w3-text-white">
						` + json["pick"] + `
					</b>
				</p>
			</div>
		`);

		AjaxLoading(false);

		fillPlayer();
	}).fail(function(jqXHR, msg) {
		AjaxLoading(2);

		newQuestion();
	});
}

function playerAddCards(total = 10) {
	if ($("#cards td").length < total) {
		$.postJSON(GetDomain() + "game2/ajax.php", {
			operation: "addCards",
			id: getUrlVar("id"),
			sum: total - $("#cards td").length,
		}).done(function(json) {
			console.log(json);

			$.each(json, function(k, v) {
				$("#cards").append(`
					<td>
						<div style="width: 200px" class="w3-card w3-white w3-container w3-medium">
							<p style="min-height: 175px">
								` + v["text"] + `
							</p>
							<p class="w3-tiny w3-text-grey">
								` + v["id"] + `
								` + v["box"] + `
								` + v["vote"] + `
							</p>
						</div>
					</td>
				`);
			});

			AjaxLoading(false);
		}).fail(function(jqXHR, msg) {
			AjaxLoading(2);

			playerAddCards();
		});

	}

	playerOwnCards();
}

function playerOwnCards() {

}

function choosePlayer() {

}

function downvoteCard(id) {

}

function finishRound(id) {

}
