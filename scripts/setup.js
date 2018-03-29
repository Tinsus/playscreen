function showConfig() {
	if ($("#name").val().length == 0) {
		return false;
	}

	$("#name_button").addClass("w3-disabled");
	$("#name_button").prop("disabled", true);

	config();
}

function waitForPlayers(color) {
	$("#player").hide();

	$("#next").html(`
		<div class="w3-jumbo w3-center w3-container w3-` + color + `">
			` + $("#name").val() + `
		</div>
		<div class="w3-container w3-center">
			<i class="fa fa-spinner fa-pulse w3-jumbo w3-padding" id="wait"></i>
			<p>
				` + GetLoca("WAITFOROTHERS") + `
			</p>
		</div>
	`);

	$.postJSON(GetDomain() + "ajax.php", {
		operation: "allChoosen",
		id: getUrlVar("id"),
	}).done(function(json) {
		if (json == true) {
			countdown();
		} else {
			setTimeout("waitForPlayers('" + color + "')", 200);
		}
	}).fail(function(jqXHR, msg) {
		waitForPlayers(color);
	});
}

function customize() {
	if ($("#name").val().length == 0) {
		return false;
	}

	$("#name_button").addClass("w3-disabled");
	$("#name_button").prop("disabled", true);

	donext();
}
