function setupGame() {
	if (IsServer()) {
		AjaxLoading(true);

		$("#game").addClass("w3-container");

		$("#game").html(`
			<table class="w3-table-all">
				<tr>
					<th>
						` + GetLoca("PLAYER") + `:
					</th>
					<th>
						` + GetLoca("WINS") + `:
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

			getQuestion();

			AjaxLoading(false);
		}).fail(function(jqXHR, msg) {
			AjaxLoading(2);

			setupGame();
		});
	} else {
		$("#game").addClass("w3-container");

		$("#game").html(`
			<div id="asked" class="w3-container">
			</div>
			<div class="w3-container w3-responsive">
				<table class="w3-table-all">
					<tr id="cards">
					</tr>
				</table>
			</div>
		`);

		playerAddCards();
		getQuestion();
	}
}

function newQuestion() {
	$.postJSON(GetDomain() + "game2/ajax.php", {
		operation: "newQuestion",
		id: getUrlVar("id"),
	}).done(function(json) {
		getQuestion();

		AjaxLoading(false);
	}).fail(function(jqXHR, msg) {
		AjaxLoading(2);

		newQuestion();
	});
}

function getQuestion() {
	$.postJSON(GetDomain() + "game2/ajax.php", {
		operation: "getQuestion",
		id: getUrlVar("id"),
	}).done(function(json) {
		if (!json) {
			if (IsServer()) {
				newQuestion();
			} else {
				getQuestion();
			}
		} else {
			if (IsServer()) {
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
			} else {
				$("#asked").html(`
					<div class="w3-medium w3-margin">
						<div class="w3-card w3-black w3-container">
							<p class="w3-left w3-container">
								` + json["text"] + `
							</p>
							<div class="w3-right w3-container">
								<button id="upvote` + json["id"] + `" class="w3-btn w3-black w3-text-grey" onClick="vote(1, ` + json["id"] + `)">
									<i class="fa fa-thumbs-o-up fa-1"></i>
								</button>
								<button id="downvote` + json["id"] + `" class="w3-btn w3-black w3-text-grey" onClick="vote(-1, ` + json["id"] + `)">
									<i class="fa fa-thumbs-o-down fa-1"></i>
								</button>
							</div>
						</div>
					</div>
				`);
			}
		}

		AjaxLoading(false);
	}).fail(function(jqXHR, msg) {
		AjaxLoading(2);

		newQuestion();
	});
}

function vote(value, id) {
	$("#upvote" + id).addClass("w3-disabled");
	$("#downvote" + id).addClass("w3-disabled");
	$("#upvote").attr("disabled", true);
	$("#downvote").attr("disabled", true);

	if (value > 0) {
		$("#upvote" + id).removeClass("w3-text-grey");
	} else {
		$("#downvote" + id).removeClass("w3-text-grey");
	}

	AjaxLoading(true);

	$.postJSON(GetDomain() + "game2/ajax.php", {
		operation: "voteCard",
		id: id,
		value: value,
	}).done(function(json) {
		AjaxLoading(false);
	}).fail(function(jqXHR, msg) {
		AjaxLoading(2);

		playerAddCards();
	});
}

function playerAddCards() {
	AjaxLoading(true);

	$.postJSON(GetDomain() + "game2/ajax.php", {
		operation: "addCards",
		id: getUrlVar("id"),
	}).done(function(json) {
		playerOwnCards();

		AjaxLoading(false);
	}).fail(function(jqXHR, msg) {
		AjaxLoading(2);

		playerAddCards();
	});
}

function playerOwnCards() {
	AjaxLoading(true);

	$.postJSON(GetDomain() + "game2/ajax.php", {
		operation: "ownCards",
		id: getUrlVar("id"),
	}).done(function(json) {
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

					<p class="w3-container w3-center w3-tiny">
						<button id="upvote` + json["id"] + `" class="w3-btn w3-pale-green w3-text-grey" onClick="vote(1, ` + json["id"] + `)">
							<i class="fa fa-thumbs-o-up fa-1"></i>
						</button>
						<button id="downvote` + json["id"] + `" class="w3-btn w3-pale-red w3-text-grey" onClick="vote(-1, ` + json["id"] + `)">
							<i class="fa fa-thumbs-o-down fa-1"></i>
						</button>
					</p>
				</td>
			`);
		});

		AjaxLoading(false);
	}).fail(function(jqXHR, msg) {
		AjaxLoading(2);

		playerOwnCards();
	});
}

function finishRound(id) {

}
