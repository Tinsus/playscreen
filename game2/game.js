function setupGame() {
	if (IsServer()) {
		AjaxLoading(true);

		$("#game").addClass("w3-container");

		$("#game").html(`
			<table id="scores" class="w3-table-all">
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
			</div>
			<div class="w3-container w3-padding">
				<table id="answers" class="w3-table-all w3-responsive">
				</table>
			</div>
		`);

		$.postJSON(GetDomain() + "ajax.php", {
			operation: "getGameData",
			id: getUrlVar("id"),
		}).done(function(json) {
			$.each(json.playerdata, function(k, v) {
				var wins = v["wins"];

				if (wins == undefined) {
					wins = 0;
				}

				$("#scores").append(`
					<tr>
						<td id="name` + k + `" class="w3-` + v.tag + `">
							<span class="w3-` + v.tag + `">
								` + v["name"] + `
							</span>
						</td>
						<td id="points` + k + `" class="w3-` + v.tag + `">
							` + wins + `
						</td>
					</tr>
				`);
			});

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
			<div id="iammaster" class="w3-container w3-row w3-padding" style="display: none;">
				<div class="w3-center">
					<h1>
						` + GetLoca("YOU_ARE_MASTER") + `
					</h1>
					<p>
						` + GetLoca("CHECK_MONITOR_FOR_RESULTS") + `
					</p>
				</div>
			</div>
			<div id="addAnswer" class="w3-container w3-row w3-padding" style="display: none;">
				<div class="w3-third w3-center">
					` + GetLoca("NEW_ANSWER") + `:
				</div>
				<div class="w3-third w3-center">
					<textarea id="addAnswerVal" class="w3-input" style="height: 40px;"></textarea>
				</div>
				<div class="w3-third w3-center">
					<button onclick="addAnswer()" class="w3-button w3-green">
						<i class="fa fa-plus"></i>
					</button>
				</div>
			</div>
			<div id="addQuestion" class="w3-container w3-row w3-padding" style="display: none;">
				<div class="w3-third w3-center">
					` + GetLoca("NEW_QUESTION") + `:
				</div>
				<div class="w3-third w3-center">
					<textarea id="addQuestionVal" class="w3-input" style="height: 40px;"></textarea>
				</div>
				<div class="w3-third w3-center w3-bar">
					<span class="w3-bar-item">
						` + GetLoca("PICK") + `
					</span>
					<button onclick="addQuestion(1)" class="w3-button w3-green w3-bar-item">
						1
					</button>
					<button onclick="addQuestion(2)" class="w3-button w3-green w3-bar-item">
						2
					</button>
					<button onclick="addQuestion(3)" class="w3-button w3-green w3-bar-item">
						3
					</button>
					<button onclick="addQuestion(4)" class="w3-button w3-green w3-bar-item">
						4
					</button>
					<button onclick="addQuestion(5)" class="w3-button w3-green w3-bar-item">
						5
					</button>
				</div>
			</div>
		`);
	}

	state();
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
		if (json) {
			if (IsServer()) {
				$("#question").html(`
					<div class="w3-third">
						&nbsp;
					</div>
					<div class="w3-third w3-card w3-black w3-container w3-xlarge">
						<p style="min-height: 250px">
							` + nl2br(json["q"]["text"]) + `
						</p>
						<p class="w3-tiny w3-text-light-grey">
							` + json["q"]["id"] + `
							` + json["q"]["box"] + `
							` + json["q"]["vote"] + `
							<b class="w3-right w3-medium w3-text-white">
								` + json["q"]["pick"] + `
							</b>
						</p>
					</div>
				`);
			} else {
				$("#asked").html(`
					<div class="w3-medium w3-margin">
						<div class="w3-card w3-black w3-container">
							<p class="w3-left w3-container">
								` + nl2br(json["q"]["text"]) + `
							</p>
							<div class="w3-right w3-container">
								<button id="upvote` + json["q"]["id"] + `" class="w3-btn w3-black w3-text-grey" onClick="vote(1, ` + json["q"]["id"] + `)">
									<i class="fa fa-thumbs-o-up fa-1"></i>
								</button>
								<button id="downvote` + json["q"]["id"] + `" class="w3-btn w3-black w3-text-grey" onClick="vote(-1, ` + json["q"]["id"] + `)">
									<i class="fa fa-thumbs-o-down fa-1"></i>
								</button>
							</div>
						</div>
						<span id="num2pick" style="display: none;">
							` + json["q"]["pick"] + `
						</span>
					</div>
				`);
			}
		}

		AjaxLoading(false);
	}).fail(function(jqXHR, msg) {
		AjaxLoading(2);

		getQuestion();
	});
}

function vote(value, id) {
	$("#upvote" + id).addClass("w3-disabled");
	$("#downvote" + id).addClass("w3-disabled");
	$("#upvote" + id).attr("disabled", true);
	$("#downvote" + id).attr("disabled", true);

	if (value > 0) {
		$("#upvote" + id).removeClass("w3-text-grey");

		$("#trash" + id).addClass("w3-disabled");
		$("#trash" + id).attr("disabled", true);
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

		vote(value, id);
	});
}

function addCards(show = true) {
	AjaxLoading(true);

	$.postJSON(GetDomain() + "game2/ajax.php", {
		operation: "addCards",
		id: getUrlVar("id"),
	}).done(function(json) {
		if (show) {
			ownCards();
		}

		AjaxLoading(false);
	}).fail(function(jqXHR, msg) {
		AjaxLoading(2);

		addCards(show);
	});
}

function ownCards() {
	AjaxLoading(true);

	$("#cards").html("");

	$.postJSON(GetDomain() + "game2/ajax.php", {
		operation: "ownCards",
		id: getUrlVar("id"),
	}).done(function(json) {
		$.each(json, function(k, v) {
			$("#cards").append(`
				<td id="card` + v["id"] + `">
					<div style="width: 200px" class="w3-card w3-white w3-container w3-medium">
						<p style="min-height: 175px">
							` + nl2br(v["text"]) + `
						</p>
						<p class="w3-tiny w3-text-grey">
							` + v["id"] + `
							` + v["box"] + `
							` + v["vote"] + `
						</p>
					</div>
					<p class="w3-container w3-center picks" style="display: none; width: 200px">
						<button id="pick0-` + v["id"] + `" class="w3-btn w3-green picks` + v["id"] + ` pickall pick0" onClick="pick(0, ` + v["id"] + `)" style="width: 20%">
							` + GetLoca("PICK") + `
						</button>
						<button id="pick1-` + v["id"] + `" class="w3-btn w3-green picks` + v["id"] + ` pickall pick1" onClick="pick(0, ` + v["id"] + `)" style="width: 20%">
							1
						</button>
						<button id="pick2-` + v["id"] + `" class="w3-btn w3-green picks` + v["id"] + ` pickall pick2" onClick="pick(1, ` + v["id"] + `)" style="width: 20%">
							2
						</button>
						<button id="pick3-` + v["id"] + `" class="w3-btn w3-green picks` + v["id"] + ` pickall pick3" onClick="pick(2, ` + v["id"] + `)" style="width: 20%">
							3
						</button>
						<button id="pick4-` + v["id"] + `" class="w3-btn w3-green picks` + v["id"] + ` pickall pick4" onClick="pick(3, ` + v["id"] + `)" style="width: 20%">
							4
						</button>
						<button id="pick5-` + v["id"] + `" class="w3-btn w3-green picks` + v["id"] + ` pickall pick5" onClick="pick(4, ` + v["id"] + `)" style="width: 20%">
							5
						</button>
					</p>
					<p class="w3-container w3-center w3-tiny" style="width: 200px">
						<button id="upvote` + v["id"] + `" class="w3-btn w3-pale-green w3-text-grey upvote" onClick="vote(1, ` + v["id"] + `)">
							<i class="fa fa-thumbs-o-up"></i>
						</button>
						<button id="downvote` + v["id"] + `" class="w3-btn w3-pale-red w3-text-grey downvote" onClick="vote(-1, ` + v["id"] + `)">
							<i class="fa fa-thumbs-o-down"></i>
						</button>
						<button id="trash` + v["id"] + `" class="w3-btn w3-text-red w3-medium trash" onClick="trash(` + v["id"] + `)">
							<i class="fa fa-trash-o"></i>
						</button>
					</p>
				</td>
			`);
		});

		AjaxLoading(false);
	}).fail(function(jqXHR, msg) {
		AjaxLoading(2);

		ownCards();
	});
}

function trash(id) {
	$.postJSON(GetDomain() + "game2/ajax.php", {
		operation: "trash",
		gameid: getUrlVar("id"),
		id: id,
	}).done(function(json) {
		$("#card" + id).remove();
	}).fail(function(jqXHR, msg) {
		trash(id);
	});
}

function state() {
	$.postJSON(GetDomain() + "game2/ajax.php", {
		operation: "state",
		id: getUrlVar("id"),
	}).done(function(json) {
		switch (json) {
			case "newQuestion":
				if (IsServer()) {
					newQuestion();
				} else {
					$("#addAnswer").show();
					$("#addQuestion").hide();
				}

				break;
			case "getCards":
				if (!IsServer()) {
					addCards();
				}

				break;
			case "voteing":
				if (IsServer()) {
					getPicks(true);
				} else {
					$("#asked").html("");
					$("#cards").html("");

					picks = [];

					addCards(false);

					$("#addAnswer").hide();
					$("#addQuestion").show();
				}

				break;
			case "master":
				$("#iammaster").show();

				$("#addAnswer").show();
				$("#addQuestion").show();

				break;
			case "picking":
				if (IsServer()) {
					getPicks(false);

					break;
				}
			default:
				$("#iammaster").hide();

				if (!IsServer()) {
					if (picks.length == 0) {
						if ($("#asked").html().trim().length == 0) {
							getQuestion();

							break;
						}

						if ($("#cards").html().trim().length == 0) {
							ownCards();

							break;
						}

						if (!$(".picks").is(":visible")) {
							$(".picks").show();
							$(".pickall").hide();

							switch (parseInt($("#num2pick").html())) {
								case 5:
									$(".pick5").show();
								case 4:
									$(".pick4").show();
								case 3:
									$(".pick3").show();
								case 2:
									$(".pick2").show();
									$(".pick1").show();

									break;
								case 1:
									$(".pick0").show();

									break;
							}

							$(".pickall").css("width", (100 / parseInt($("#num2pick").html())) + "%")

							break;
						}
					}
				} else {
					if ($("#question").html().trim().length == 0) {
						getQuestion();

						break;
					}
				}
		}

		if (IsServer()) {
			setTimeout("state()", 1000);
		} else {
			setTimeout("state()", 500);
		}
	}).fail(function(jqXHR, msg) {
		state();
	});
}

var picks = [];

function pick(n, id) {
	$("#trash" + id).addClass("w3-disabled");
	$("#trash" + id).attr("disabled", true);
	$("#downvote" + id).addClass("w3-disabled");
	$("#downvote" + id).attr("disabled", true);

	if (picks.indexOf(id) == -1) {
		picks[picks.indexOf(id)] = undefined;
	}

	picks[n] = id;

	$(".pickall").removeClass("w3-pale-blue");
	$(".pickall").removeClass("w3-blue");
	$(".pickall").addClass("w3-green");

	if (parseInt($("#num2pick").html()) != 1) {
		$.each(picks, function(k, v) {
			$(".pick" + (k + 1)).removeClass("w3-green");
			$(".pick" + (k + 1)).addClass("w3-pale-blue");

			$(".picks" + v).removeClass("w3-green");
			$(".picks" + v).addClass("w3-pale-blue");

			$("#pick" + (k + 1) + "-" + v).removeClass("w3-pale-blue");
			$("#pick" + (k + 1) + "-" + v).addClass("w3-blue");
		});
	} else {
		$.each(picks, function(k, v) {
			$(".pick" + k).removeClass("w3-green");
			$(".pick" + k).addClass("w3-pale-blue");

			$(".picks" + v).removeClass("w3-green");
			$(".picks" + v).addClass("w3-pale-blue");

			$("#pick" + k + "-" + v).removeClass("w3-pale-blue");
			$("#pick" + k + "-" + v).addClass("w3-blue");
		});
	}

	if (picks.length >= parseInt($("#num2pick").html())) {
		$(".pickall").addClass("w3-disabled");
		$(".pickall").attr("disabled", true);

		setTimeout("submitPick()", 3000);
	}
}

function submitPick() {
	AjaxLoading(true);

	$.postJSON(GetDomain() + "game2/ajax.php", {
		operation: "submitPick",
		id: getUrlVar("id"),
		pick0: picks[0],
		pick1: picks[1],
		pick2: picks[2],
		pick3: picks[3],
		pick4: picks[4],
	}).done(function(json) {
		AjaxLoading(false);
	}).fail(function(jqXHR, msg) {
		AjaxLoading(2);

		submitPick();
	});
}

var last = "";

function wins(id) {
	$(".creator").hide();
	$(".fromcreator").fadeIn();
	$(".technical").fadeIn();
	$(".hidden").fadeIn();
	$(".shown").hide();

	setTimeout(function() {
		$.postJSON(GetDomain() + "game2/ajax.php", {
			operation: "wins",
			id: getUrlVar("id"),
			win: id,
		}).done(function(json) {
			$("#question").html("");
			$("#answers").html("");

			$("#points" + id).html(json);
		}).fail(function(jqXHR, msg) {
			wins(id);
		});
	}, 5000);
}

function getPicks(vote) {
	$.postJSON(GetDomain() + "game2/ajax.php", {
		operation: "getPicks",
		id: getUrlVar("id"),
	}).done(function(json) {
		if (JSON.stringify(json) != last ) {
			last = JSON.stringify(json);

			$("#answers").html("");

			$.each(json, function(k, v) {
				var html = `
					<tr id="from` + k + `">
						<td id="fromcreator` + k + `" class="fromcreator" style="display: none;" width="10%">
						</td>
						<td class="creator" width="10%">
							<button class="w3-btn votes w3-green" style="min-height: 250px; width: 100%;" onclick="wins(` + k + `)">
								` + GetLoca("WINS") + `
							</button>
						</td>
					</tr>
				`;

				setTimeout(function() {
					$("#fromcreator" + k).html(`
						<button class="w3-btn" style="min-height: 250px; width: 100%;">
						</button>
					`);

					$("#fromcreator" + k + " button").html(`
						<b>
							` + $("#name" + k + " span").html() + `
						</b>
					`);

					$("#fromcreator" + k).addClass(
						$($("#name" + k).html()).attr("class")
					);
				}, 5000);

				if (Math.random() < 0.5) {
					$("#answers").prepend(html);
				} else {
					$("#answers").append(html);
				}

				$.each(v, function(k2, v2) {
					$("#from" + k).append(`
						<td id="shown` + k + `-` + k2 + `" class="shown" width="25%">
							<div class="w3-card w3-white w3-container w3-xlarge">
								<button class="w3-btn votes" style="min-height: 250px; width: 100%;" onclick="$('#hidden` + k + `-` + k2 + `').fadeIn(); $('#shown` + k + `-` + k2 + `').hide();">
									` + GetLoca("SHOW") + `
								</button>
							</div>
						</td>
					`);

					$("#from" + k).append(`
						<td id="hidden` + k + `-` + k2 + `" class="hidden" style="display: none;" width="25%">
							<div class="w3-card w3-white w3-container w3-xlarge">
								<div style="min-height: 250px; width: 100%;"
									<p>
										` + nl2br(v2["text"]) + `
									</p>
									<p class="technical w3-tiny w3-text-grey" style="display: none;">
										` + v2["id"] + `
										` + v2["box"] + `
										` + v2["vote"] + `
										<b class="w3-right w3-medium w3-text-white">
											` + v2["pick"] + `
										</b>
									</p>
								</div>
							</div>
						</td>
					`);
				});
			});

			if (!vote) {
				$(".votes").addClass("w3-disabled");
				$(".votes").attr("disabled", true);
			}
		}
	}).fail(function(jqXHR, msg) {
		getPicks();
	});
}

function addAnswer() {
	AjaxLoading(true);

	$.postJSON(GetDomain() + "game2/ajax.php", {
		operation: "addAnswer",
		id: getUrlVar("id"),
		answer: $("#addAnswerVal").val(),
	}).done(function(json) {
		$("#addAnswerVal").val("");

		ownCards();

		AjaxLoading(false);
	}).fail(function(jqXHR, msg) {
		AjaxLoading(2);

		addAnswer();
	});
}

function addQuestion(pick) {
	AjaxLoading(true);

	$.postJSON(GetDomain() + "game2/ajax.php", {
		operation: "addQuestion",
		id: getUrlVar("id"),
		answer: $("#addQuestionVal").val(),
		pick: pick,
	}).done(function(json) {
		$("#addQuestionVal").val("");

		AjaxLoading(false);
	}).fail(function(jqXHR, msg) {
		AjaxLoading(2);

		addQuestion();
	});
}
