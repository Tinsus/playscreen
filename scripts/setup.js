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

function watchAvatars() {
	$.postJSON(GetDomain() + "ajax.php", {
		operation: "getGameData",
		id: getUrlVar("id"),
	}).done(function(json) {
		$.each(json["playerdata"], function(k, v) {
			$("#" + v["tag"]).addClass("w3-disabled");
			$("#" + v["tag"]).prop("disabled", true);
			$("#" + v["tag"]).attr("onclick", false);

			$("#" + v["tag"]).html(`
				<span class="w3-large">
					` + v["name"] + `
				</span>
			`);
		});

		if (json["playerdata"].length != json["numplayer"]) {
			setTimeout("watchAvatars()", 200);
		} else {
			getAvatars().forEach(function(v) {
				$("#avatar div button").addClass("w3-disabled");
				$("#avatar div button").prop("disabled", true);
				$("#avatar div button").attr("onclick", false);
			});

			checkCountdown();
		}
	}).fail(function(jqXHR, msg) {
		watchAvatars();
	});
}

function selectAvatar(tag) {
	AjaxLoading(true);

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

function checkCountdown() {
	$.postJSON(GetDomain() + "ajax.php", {
		operation: "checkCountdown",
		id: getUrlVar("id"),
	}).done(function(json) {
		if (json == false) {
			setTimeout("checkCountdown()", 200);
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
