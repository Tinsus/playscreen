function setupAvatars() {
	if ($("#name").val().length == 0) {
		return false;
	}

	$("#name_button").addClass("w3-disabled");
	$("#name_button").prop("disabled", true);

	if (IsServer()) {
		$.postJSON(GetDomain() + "ajax.php", {
			operation: "gameName",
			id: getUrlVar("id"),
			name: $("#name").val(),
		}).done(function(json) {
			$("#player").fadeOut();

			showAvatars();

			AjaxLoading(false);
		}).fail(function(jqXHR, msg) {
			AjaxLoading(2);

			setupAvatars();
		});
	} else {
		showAvatars();
	}
}

function showAvatars() {
	$("#avatar").html(`
		<div class="w3-row">
		</div>
	`);

	getAvatars().forEach(function(v) {
		$("#avatar div").append(`
			<button class="w3-quarter ` + v[1] + `" style="height: 150px;" id="` + v[0] + `">
				&nbsp;
			</button>
		`);

		if (IsServer()) {
			$("#avatar div button:last").addClass("w3-disabled");
			$("#avatar div button:last").prop("disabled", true);
		} else {
			$("#avatar div button:last").attr("onclick", "selectAvatar('" + v[0] + "')");
		}
	});

	$("#avatar").fadeIn();

	watchAvatars();
}

var selected = false;
var rejoined = false;

function watchAvatars() {
	$.postJSON(GetDomain() + "ajax.php", {
		operation: "getGameData",
		id: getUrlVar("id"),
	}).done(function(json) {
		if (rejoined) {
			$("#avatar div button").addClass("w3-disabled");
			$("#avatar div button").prop("disabled", true);
			$("#avatar div button").attr("onclick", false);
		}

		$.each(json["playerdata"], function(k, v) {
			var active = false;
			var known = false;

			$.each(json["player"], function(k2, v2) {
				if (v2[0] == k) {
					known = true;
					active = Date.now()/1000 - v2[1] <= 120;
				}
			});

			if (rejoined) {
				if (!active && known) {
					$("#" + v["tag"]).removeClass("w3-disabled");
					$("#" + v["tag"]).prop("disabled", false);
					$("#" + v["tag"]).attr("onclick", "hijackAvatar('" + v["tag"] + "')");
				}
			} else {
				$("#" + v["tag"]).addClass("w3-disabled");
				$("#" + v["tag"]).prop("disabled", true);
				$("#" + v["tag"]).attr("onclick", false);
			}

			$("#" + v["tag"]).html(`
				<span class="w3-large">
					` + v["name"] + `
				</span>
			`);
		});

		if (selected) {
			$("#avatar div button").addClass("w3-disabled");
			$("#avatar div button").prop("disabled", true);
			$("#avatar div button").attr("onclick", false);
		}

		checkCountdown();
	}).fail(function(jqXHR, msg) {
		watchAvatars();
	});
}

function selectAvatar(tag) {
	AjaxLoading(true);
	selected = true;

	$.postJSON(GetDomain() + "ajax.php", {
		operation: "selectAvatar",
		avatar: tag,
		id: getUrlVar("id"),
		name: $("#name").val(),
	}).done(function(json) {
		$("#player").fadeOut();

		AjaxLoading(false);
	}).fail(function(jqXHR, msg) {
		AjaxLoading(2);

		selectAvatar(tag);
	});
}

function hijackAvatar(tag) {
	AjaxLoading(true);
	selected = true;

	$.postJSON(GetDomain() + "ajax.php", {
		operation: "hijackAvatar",
		avatar: tag,
		id: getUrlVar("id"),
		name: $("#name").val(),
	}).done(function(json) {
		$("#player").fadeOut();

		AjaxLoading(false);
	}).fail(function(jqXHR, msg) {
		AjaxLoading(2);

		hijackAvatar(tag);
	});
}

function checkCountdown() {
	$.postJSON(GetDomain() + "ajax.php", {
		operation: "checkCountdown",
		id: getUrlVar("id"),
	}).done(function(json) {
		if (json == false) {
			setTimeout("watchAvatars()", 300);
		} else {
			countdown(10);
		}
	}).fail(function(jqXHR, msg) {
		checkCountdown();
	});
}

function countdown(timer) {
	$("#header").html(`
		<button class="w3-theme-l4 w3-jumbo">
			` + timer.toFixed(2) + `s
		</button>
	`);

	$("#header button").css("width", $(window).width());
	$("#header button").css("height", $(window).height());

	if (timer <= 0.01) {
		location.href = GetDomain() + "play.php?id=" + getUrlVar("id");
	} else {
		setTimeout("countdown(" + (timer - 0.01) + ")", 10);
	}
}

function rejoin() {
	$.postJSON(GetDomain() + "ajax.php", {
		operation: "getGameData",
		id: getUrlVar("id"),
	}).done(function(json) {

		if (IsServer()) {
			if (json["gamedata"]["length"] != 0) {
				$("#name").val(json["settings"]["name"]);

				setupAvatars();
			}
		} else {
			var sessionid = document.cookie.match('PHPSESSID=([^;]*)')[1];
			var keys = new Array();

			for (var key in json["player"]) {
				keys.push(key);
			}

			var id = keys.indexOf(sessionid);

			if (json["player"][sessionid] != undefined && id != undefined) {
				$("#name").val(json["playerdata"][id]["name"]);
				$("#player").fadeOut();
				selected = true;

				showAvatars();
				watchAvatars();
			} else if (json["gamedata"]["length"] != 0) {
				rejoined = true;
			}
		}

		AjaxLoading(false);
	}).fail(function(jqXHR, msg) {
		AjaxLoading(2);

		rejoin();
	});
}
