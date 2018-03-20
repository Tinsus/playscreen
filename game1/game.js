function setupGame() {
	$("#game").html(`
		<div class="w3-cell-row">
			<div class="w3-cell corner">
				&nbsp;
			</div>
			<div id="player1" class="w3-white w3-cell">
				&nbsp;
			</div>
			<div class="w3-cell corner">
				&nbsp;
			</div>
		</div>
		<div class="w3-cell-row">
			<div id="player2" class="w3-white w3-cell">
				&nbsp;
			</div>
			<div class="w3-cell">
				<img id="board" src="` + GetDomain() + `game` + game["game"] + `/logo.svg" alt="game ` + game["game"] + ` logo" style="height: 1px; width: 1px;"/>
			</div>
			<div id="player4" class="w3-white w3-cell">
				&nbsp;
			</div>
		</div>
		<div class="w3-cell-row">
			<div class="w3-cell corner">
				&nbsp;
			</div>
			<div id="player3" class="w3-white w3-cell">
				&nbsp;
			</div>
			<div class="w3-cell corner">
				&nbsp;
			</div>
		</div>
	`);

	setTimeout(function() {
		var times = $("#pagecontent").height();
		
		$(".corner").height(times / 10);
		$(".corner").width(times / 10);

		$("#player2").width(times / 10);
		$("#player4").width(times / 10);
		
		$("#board").height(times / 10 * 8);
		$("#board").width(times / 10 * 8);
		
		$("#board").css("margin-left", ($("#pagecontent").width() - $("#player2").width() * 2 - times / 10 * 8) / 2);
		
		 $("#board").click(function (e) { //Relative ( to its parent) mouse position 
			var posX = $(this).position().left + parseFloat($("#board").css("margin-left")),
				posY = $(this).position().top;
			alert((e.pageX - posX) + ' , ' + (e.pageY - posY));
		});
	}, 1000);

//$("#pagecontent").width()
//$("#pagecontent").height()
	$.postJSON(GetDomain() + "ajax.php", {
		operation: "waitForGame",
		gameid: id,
	}).done(function(json) {
		if (json == true) {
			location.href = GetDomain() + "custom.php?id=" + id;
		}

		setTimeout("waitForGame(" + id + ")", 1000);
	}).fail(function(jqXHR, msg) {
		waitForGame(id);
	});
}

function waitForPlayers(color) {
	$("#player").hide();

	$("#customize").html(`
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
}
