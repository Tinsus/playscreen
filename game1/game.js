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
		$("#player2").height(height / 10 * 8);

		$("#board").html(`
			<svg id="svg">
			</svg>
		`);

		$("#svg").width(height / 10 * 8);
		$("#svg").height(height / 10 * 8);

		$("#svg").css("margin-left", (width - height) / 2);

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

	var step = $("#svg").width() / 11;

	var points = [
		[
			0,
			0,
			"red",
			"redpos1",
		], [
			0,
			1,
			"red",
			"redpos2",
		], [
			0,
			4,
			"black",
			"field39",
		], [
			0,
			5,
			"black",
			"field40",
		], [
			0,
			6,
			"bluestart",
			"field1",
		], [
			0,
			9,
			"blue",
			"bluepos1",
		], [
			0,
			10,
			"blue",
			"bluepos2",
		], [
			1,
			0,
			"red",
			"redpos3",
		], [
			1,
			1,
			"red",
			"redpos4",
		], [
			1,
			4,
			"black",
			"field38",
		], [
			1,
			5,
			"blue",
			"bluegoal1",
		], [
			1,
			6,
			"black",
			"field2",
		], [
			1,
			9,
			"blue",
			"bluepos3",
		], [
			1,
			10,
			"blue",
			"bluepos4",
		], [
			2,
			4,
			"black",
			"field37",
		], [
			2,
			5,
			"blue",
			"bluegoal2",
		], [
			2,
			6,
			"black",
			"field3",
		], [
			3,
			4,
			"black",
			"field36",
		], [
			3,
			5,
			"blue",
			"bluegoal3",
		], [
			3,
			6,
			"black",
			"field4",
		], [
			4,
			0,
			"redstart",
			"field31",
		], [
			4,
			1,
			"black",
			"field32",
		], [
			4,
			2,
			"black",
			"field33",
		], [
			4,
			3,
			"black",
			"field34",
		], [
			4,
			4,
			"black",
			"field35",
		], [
			4,
			5,
			"blue",
			"bluegoal4",
		], [
			4,
			6,
			"black",
			"field5",
		], [
			4,
			7,
			"black",
			"field6",
		], [
			4,
			8,
			"black",
			"field7",
		], [
			4,
			9,
			"black",
			"field8",
		], [
			4,
			10,
			"black",
			"field9",
		], [
			5,
			0,
			"black",
			"field30",
		], [
			5,
			1,
			"red",
			"redgoal1",
		], [
			5,
			2,
			"red",
			"redgoal2",
		], [
			5,
			3,
			"red",
			"redgoal3",
		], [
			5,
			4,
			"red",
			"redgoal4",
		], [
			5,
			6,
			"yellow",
			"yellowgoal4",
		], [
			5,
			7,
			"yellow",
			"yellowgoal3",
		], [
			5,
			8,
			"yellow",
			"yellowgoal2",
		], [
			5,
			9,
			"yellow",
			"yellowgoal1",
		], [
			5,
			10,
			"black",
			"field10",
		], [
			6,
			0,
			"black",
			"field29",
		], [
			6,
			1,
			"black",
			"field28",
		], [
			6,
			2,
			"black",
			"field27",
		], [
			6,
			3,
			"black",
			"field26",
		], [
			6,
			4,
			"black",
			"field25",
		], [
			6,
			5,
			"green",
			"greengoal4",
		], [
			6,
			6,
			"black",
			"field15",
		], [
			6,
			7,
			"black",
			"field14",
		], [
			6,
			8,
			"black",
			"field13",
		], [
			6,
			9,
			"black",
			"field12",
		], [
			6,
			10,
			"yellow",
			"yellowstart",
		], [
			7,
			4,
			"black",
			"field24",
		], [
			7,
			5,
			"green",
			"greengoal3",
		], [
			7,
			6,
			"black",
			"field16",
		], [
			8,
			4,
			"black",
			"field23",
		], [
			8,
			5,
			"green",
			"greengoal2",
		], [
			8,
			6,
			"black",
			"field17",
		], [
			9,
			1,
			"green",
			"greenpos1",
		], [
			9,
			2,
			"green",
			"greenpos2",
		], [
			9,
			4,
			"black",
			"field22",
		], [
			9,
			5,
			"green",
			"greengoal1",
		], [
			9,
			6,
			"black",
			"field18",
		], [
			9,
			9,
			"yellow",
			"yellowpos1",
		], [
			9,
			10,
			"yellow",
			"yellowpos2",
		], [
			10,
			1,
			"green",
			"greenpos3",
		], [
			10,
			2,
			"green",
			"greenpos4",
		], [
			10,
			4,
			"greenstart",
			"field21",
		], [
			10,
			5,
			"black",
			"field20",
		], [
			10,
			6,
			"black",
			"field19",
		], [
			10,
			9,
			"yellow",
			"yellowpos3",
		], [
			10,
			10,
			"yellow",
			"yellowpos4",
		],
	];

	for (len = points.length, i = 0; i < len; ++i) {
		var point = s.circle(step * (points[i][1] + 0.5), step * (points[i][0] + 0.5), step * 0.4);
	}

/*
	var bigCircle = s.circle(150, 150, 100);

//*/
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
