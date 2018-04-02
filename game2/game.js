function setupGame() {
	AjaxLoading(true);

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
		console.log(json);

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
				<p class="w3-medium">
					<span class="w3-tiny w3-text-grey">
						` + json["id"] + `
					</span>
					<span class="w3-tiny w3-text-grey">
						` + json["box"] + `
					</span>
					<span class="w3-tiny w3-text-grey">
						` + json["vote"] + `
					</span>
					<b class="w3-right">
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

function fillPlayer() {

}

function playerOwnCards() {

}

function choosePlayer() {

}

function downvoteCard(id) {

}

function finishRound(id) {

}
