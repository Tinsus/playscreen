function config() {
	$("#config").html(`
		<div class="w3-row">
		</div>
	`);

	var colors = [
		"red",
		"blue",
		"green",
		"yellow"
	];

	colors.forEach(function(s) {
		$("#config div:first").append(`
			<div class="w3-disabled w3-quarter w3-` + s + `" style="height: 150px;" id="` + s + `" disabled>
				&nbsp;
			</div>
		`);
	});

	$("#config").fadeIn();

	watchPlayers();
}

keepwatching = true;

function watchPlayers() {
	if (keepwatching) {
		$.postJSON(GetDomain() + "game1/ajax.php", {
			operation: "watchPlayers",
			id: getUrlVar("id"),
		}).done(function(json) {
			$.each(json, function(k, v) {
				$("#" + v[0]).addClass("ready");
				$("#" + v[0]).removeClass("w3-disabled");
				$("#" + v[0]).prop("disabled", false);
				$("#" + v[0]).html(`
					<center class="w3-padding w3-large">
						` + v[1] + `
					</center>
				`);

				if ($(".ready").length == v[2]) {
					keepwatching = false;

					startCountdown();
				}
			});

			setTimeout("watchPlayers()", 200);
		}).fail(function(jqXHR, msg) {
			watchPlayers();
		});
	}
}

function startCountdown() {
	$.postJSON(GetDomain() + "ajax.php", {
		operation: "startCountdown",
		id: getUrlVar("id"),
		settings: [],
	}).done(function(json) {
		setTimeout("countdown(10)", 200);
	}).fail(function(jqXHR, msg) {
		startCountdown();
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

	if (timer <= 0) {
		location.href = GetDomain() + "host.php?id=" + getUrlVar("id");
	} else {
		setTimeout("countdown(" + (timer - 0.01) + ")", 10);
	}
}
