function donext() {
	$("#next").html(`
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
		$("#next div").append(`
			<button class="w3-quarter w3-` + s + `" style="height: 150px;" id="` + s + `" onclick='selectColor("` + s + `")'>
				&nbsp;
			</button>
		`);
	});

	$("#next").fadeIn();

	watchColors();
}

checkColor = true;

function watchColors() {
	if (checkColor) {
		$.postJSON(GetDomain() + "game1/ajax.php", {
			operation: "watchColors",
			id: getUrlVar("id"),
		}).done(function(json) {
			$.each(json, function(k, v) {
				$("#" + v).addClass("w3-disabled");
				$("#" + v).prop("disabled", true);
			});

			$("#id").html(json);

			setTimeout("watchColors()", 200);
		}).fail(function(jqXHR, msg) {
			watchColors();
		});
	}
}


function selectColor(color) {
	AjaxLoading(true);

	$.postJSON(GetDomain() + "game1/ajax.php", {
		operation: "selectColor",
		color: color,
		id: getUrlVar("id"),
		name: $("#name").val(),
	}).done(function(json) {
		checkColor = false;

		waitForPlayers(color);

		AjaxLoading(false);
	}).fail(function(jqXHR, msg) {
		AjaxLoading(2);

		selectColor(color);
	});
}
