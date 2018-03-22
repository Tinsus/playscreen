function setupGame() {
	$("#game").html(`
		<table>
			<tr>
				<td class="corner">
					&nbsp;
				</td>
				<td class="w3-white" id="player1">
					&nbsp;
				</td>
				<td class="corner">
					&nbsp;
				</td>
			</tr>
			<tr>
				<td class="w3-white" id="player2">
					&nbsp;
				</td>
				<td id="board">
					&nbsp;
				</td>
				<td class="w3-white" id="player4">
					&nbsp;
				</td>
			</tr>
			<tr>
				<td class="corner">
					&nbsp;
				</td>
				<td class="w3-white" id="player3">
					&nbsp;
				</td>
				<td class="corner">
					&nbsp;
				</td>
			</tr>
		</table>
		`);

	setTimeout(function() {
		var height = $("#pagecontent").height();
		var width = $("#pagecontent").width();

		$(".corner").width(height / 10);
		$(".corner").height(height / 10);

		$("#player1").width(width - height / 10 * 2);
		$("#player1").height(height / 10);
		$("#player2").width(height / 10);
		$("#player2").height(height / 10 * 8);
		$("#player3").width(width - height / 10 * 2);
		$("#player3").height(height / 10);
		$("#player4").width(height / 10);
		$("#player4").height(height / 10 * 8);

		$("#board").html(`
			<svg id="svg">
			</svg>
		`);

		$("#svg").width(width - height / 10 * 2);
		$("#svg").height(height / 10 * 8);

/*
		$("#board").click(function (e) { //Relative ( to its parent) mouse position
			var posX = $(this).position().left + parseFloat($("#board").css("margin-left")),
				posY = $(this).position().top;
			alert((e.pageX - posX) + ' , ' + (e.pageY - posY));
		});
//*/
/*
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
//*/

		drawBoard();
	}, 1000);

}

function drawBoard() {
	var s = Snap("#svg");

	var bigCircle = s.circle(150, 150, 100);
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
