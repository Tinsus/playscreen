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
			0, 0,
			11, 0,
		], [
			0, 11,
			0, 0,
		], [
			0, 11,
			11, 11,
		], [
			11, 0,
			11, 11,
		],
	];

	for (len = points.length, i = 0; i < len; ++i) {
		var line = s.line(
			step * (points[i][1]), step * (points[i][0]),
			step * (points[i][3]), step * (points[i][2])
		);

		line.attr({
			stroke: "#000",
			strokeWidth: 3,
		});
	}

	var points = [
		[
			0, 4,
			0, 6,
		], [
			0, 4,
			4, 4,
		], [
			0, 5,
			4, 5,
		], [
			0, 6,
			4, 6,
		], [
			4, 0,
			4, 4,
		], [
			4, 6,
			4, 10,
		], [
			4, 0,
			6, 0,
		], [
			4, 10,
			6, 10,
		], [
			5, 0,
			5, 4,
		], [
			5, 6,
			5, 10,
		], [
			6, 0,
			6, 4,
		], [
			6, 6,
			6, 10,
		], [
			6, 4,
			10, 4,
		], [
			6, 5,
			10, 5,
		], [
			6, 6,
			10, 6,
		], [
			10, 4,
			10, 6,
		],
	];

	for (len = points.length, i = 0; i < len; ++i) {
		var line = s.line(
			step * (points[i][1] + 0.5), step * (points[i][0] + 0.5),
			step * (points[i][3] + 0.5), step * (points[i][2] + 0.5)
		);

		line.attr({
			stroke: "#888",
			strokeWidth: 3,
		});
	}

	var points = [
		[
			0, 0,
			"red",
			"redpos1",
		], [
			0, 1,
			"red",
			"redpos2",
		], [
			0, 4,
			"black",
			"field39",
		], [
			0, 5,
			"black",
			"field40",
		], [
			0, 6,
			"bluestart",
			"field1",
		], [
			0, 9,
			"blue",
			"bluepos1",
		], [
			0, 10,
			"blue",
			"bluepos2",
		], [
			1, 0,
			"red",
			"redpos3",
		], [
			1, 1,
			"red",
			"redpos4",
		], [
			1, 4,
			"black",
			"field38",
		], [
			1, 5,
			"blue",
			"bluegoal1",
		], [
			1, 6,
			"black",
			"field2",
		], [
			1, 9,
			"blue",
			"bluepos3",
		], [
			1, 10,
			"blue",
			"bluepos4",
		], [
			2, 4,
			"black",
			"field37",
		], [
			2, 5,
			"blue",
			"bluegoal2",
		], [
			2, 6,
			"black",
			"field3",
		], [
			3, 4,
			"black",
			"field36",
		], [
			3, 5,
			"blue",
			"bluegoal3",
		], [
			3, 6,
			"black",
			"field4",
		], [
			4, 0,
			"redstart",
			"field31",
		], [
			4, 1,
			"black",
			"field32",
		], [
			4, 2,
			"black",
			"field33",
		], [
			4, 3,
			"black",
			"field34",
		], [
			4, 4,
			"black",
			"field35",
		], [
			4, 5,
			"blue",
			"bluegoal4",
		], [
			4, 6,
			"black",
			"field5",
		], [
			4, 7,
			"black",
			"field6",
		], [
			4, 8,
			"black",
			"field7",
		], [
			4, 9,
			"black",
			"field8",
		], [
			4, 10,
			"black",
			"field9",
		], [
			5, 0,
			"black",
			"field30",
		], [
			5, 1,
			"red",
			"redgoal1",
		], [
			5, 2,
			"red",
			"redgoal2",
		], [
			5, 3,
			"red",
			"redgoal3",
		], [
			5, 4,
			"red",
			"redgoal4",
		], [
			5, 6,
			"yellow",
			"yellowgoal4",
		], [
			5, 7,
			"yellow",
			"yellowgoal3",
		], [
			5, 8,
			"yellow",
			"yellowgoal2",
		], [
			5, 9,
			"yellow",
			"yellowgoal1",
		], [
			5, 10,
			"black",
			"field10",
		], [
			6, 0,
			"black",
			"field29",
		], [
			6, 1,
			"black",
			"field28",
		], [
			6, 2,
			"black",
			"field27",
		], [
			6, 3,
			"black",
			"field26",
		], [
			6, 4,
			"black",
			"field25",
		], [
			6, 5,
			"green",
			"greengoal4",
		], [
			6, 6,
			"black",
			"field15",
		], [
			6, 7,
			"black",
			"field14",
		], [
			6, 8,
			"black",
			"field13",
		], [
			6, 9,
			"black",
			"field12",
		], [
			6, 10,
			"yellowstart",
			"field11",
		], [
			7, 4,
			"black",
			"field24",
		], [
			7, 5,
			"green",
			"greengoal3",
		], [
			7, 6,
			"black",
			"field16",
		], [
			8, 4,
			"black",
			"field23",
		], [
			8, 5,
			"green",
			"greengoal2",
		], [
			8, 6,
			"black",
			"field17",
		], [
			9, 0,
			"green",
			"greenpos1",
		], [
			9, 1,
			"green",
			"greenpos2",
		], [
			9, 4,
			"black",
			"field22",
		], [
			9, 5,
			"green",
			"greengoal1",
		], [
			9, 6,
			"black",
			"field18",
		], [
			9, 9,
			"yellow",
			"yellowpos1",
		], [
			9, 10,
			"yellow",
			"yellowpos2",
		], [
			10, 0,
			"green",
			"greenpos3",
		], [
			10, 1,
			"green",
			"greenpos4",
		], [
			10, 4,
			"greenstart",
			"field21",
		], [
			10, 5,
			"black",
			"field20",
		], [
			10, 6,
			"black",
			"field19",
		], [
			10, 9,
			"yellow",
			"yellowpos3",
		], [
			10, 10,
			"yellow",
			"yellowpos4",
		],
	];

	for (i = 0; i < points.length; ++i) {
		var circle = s.circle(
			step * (points[i][1] + 0.5), step * (points[i][0] + 0.5),
			step * 0.4
		);

		switch (points[i][2]) {
			case "redstart":
				var triangle = s.polygon([
					step * (points[i][1] + 0.3), step * (points[i][0] + 0.3),
					step * (points[i][1] + 0.3), step * (points[i][0] + 0.7),
					step * (points[i][1] + 0.7), step * (points[i][0] + 0.5),
				]);

				triangle.attr({
					fill: "#fff",
					stroke: "#888",
					strokeWidth: 2,
				});
			case "red":
				circle.attr({
					fill: "#f00",
					stroke: "#888",
					strokeWidth: 1,
				});

				break;
			case "greenstart":
				var triangle = s.polygon([
					step * (points[i][1] + 0.7), step * (points[i][0] + 0.7),
					step * (points[i][1] + 0.3), step * (points[i][0] + 0.7),
					step * (points[i][1] + 0.5), step * (points[i][0] + 0.3),
				]);

				triangle.attr({
					fill: "#fff",
					stroke: "#888",
					strokeWidth: 2,
				});
			case "green":
				circle.attr({
					fill: "#0f0",
					stroke: "#888",
					strokeWidth: 1,
				});

				break;
			case "bluestart":
				var triangle = s.polygon([
					step * (points[i][1] + 0.3), step * (points[i][0] + 0.3),
					step * (points[i][1] + 0.7), step * (points[i][0] + 0.3),
					step * (points[i][1] + 0.5), step * (points[i][0] + 0.7),
				]);

				triangle.attr({
					fill: "#fff",
					stroke: "#888",
					strokeWidth: 2,
				});
			case "blue":
				circle.attr({
					fill: "#00f",
					stroke: "#888",
					strokeWidth: 1,
				});

				break;
			case "yellowstart":
				var triangle = s.polygon([
					step * (points[i][1] + 0.3), step * (points[i][0] + 0.5),
					step * (points[i][1] + 0.7), step * (points[i][0] + 0.3),
					step * (points[i][1] + 0.7), step * (points[i][0] + 0.7),
				]);

				triangle.attr({
					fill: "#fff",
					stroke: "#888",
					strokeWidth: 2,
				});
			case "yellow":
				circle.attr({
					fill: "#ff0",
					stroke: "#888",
					strokeWidth: 1,
				});

				break;
		}

//		circle.addClass(points[i][3]);
	}

	var players = {
		"0-9": [
			"#00f",
			"blueplayer1",
			1,
		],
		"0-10": [
			"#00f",
			"blueplayer2",
			1,
		],
		"1-9": [
			"#00f",
			"blueplayer3",
			1,
		],
		"1-10": [
			"#00f",
			"blueplayer4",
			1,
		],
		"0-0": [
			"#f00",
			"redplayer1",
			2,
		],
		"0-1": [
			"#f00",
			"redplayer2",
			2,
		],
		"1-0": [
			"#f00",
			"redplayer3",
			2,
		],
		"1-1": [
			"#f00",
			"redplayer4",
			2,
		],
		"9-0": [
			"#0f0",
			"greenplayer1",
			3,
		],
		"9-1": [
			"#0f0",
			"greenplayer2",
			3,
		],
		"10-0": [
			"#0f0",
			"greenplayer3",
			3,
		],
		"10-1": [
			"#0f0",
			"greenplayer4",
			3,
		],
		"9-9": [
			"#ff0",
			"yellowplayer1",
			4,
		],
		"9-10": [
			"#ff0",
			"yellowplayer2",
			4,
		],
		"10-9": [
			"#ff0",
			"yellowplayer3",
			4,
		],
		"10-10": [
			"#ff0",
			"yellowplayer4",
			4,
		],
	};

	var player = getPlayerPath(step * 0.8);
	var bbox = Snap.path.getBBox(player);
	var height = $("#pagecontent").height();

	$("#board").append(`
		<div style="width: 0; height: 0; position: absolut;">
			<table id="fields">
				<tbody>
				</tbody>
			</table>
		</div>
	`);

	$("#fields").css("position", "relative");
	$("#fields").css("left", parseFloat($("#svg").css("margin-left")) * 0.99 - 2);
	$("#fields").css("top", $("#svg").height() * -1.01 - 5);

	for (i = 0; i <= 10; ++i) {
		$("#fields tbody").append(`
			<tr>
			</tr>
		`);

		for (j = 0; j <= 10; ++j) {
			$("#fields tbody tr:last").append(`
				<td>
					<div id="field` + i + `-` + j + `" class="fieldspacer">
						` + i + `-` + j + `
					</div>
				</td>
			`);

			if (players[i + "-" + j] != undefined) {
				$("#player" + players[i + "-" + j][2]).append(`
					<span id="` + players[i + "-" + j][1] + `" class="player">
						<svg>
						</svg>
					</span>
				`);

				$("#" + players[i + "-" + j][1]).width(step * 0.8);
				$("#" + players[i + "-" + j][1]).height(step * 0.8);

				var rotation = players[i + "-" + j][2] - 1;

				if (players[i + "-" + j][2]%2) {
					rotation = players[i + "-" + j][2] + 1;
				}

				$("#" + players[i + "-" + j][1] + " svg").css("transform", "rotate(" + rotation * 90 + "deg)");

				$("#" + players[i + "-" + j][1]).draggable();

				var s = Snap("#" + players[i + "-" + j][1] + " svg");

				var figure = s.path(player);

				figure.attr({
					fill: players[i + "-" + j][0],
					stroke: "#888",
					strokeWidth: 2,
					transform: "t" + ($("#" + players[i + "-" + j][1]).width() - bbox.width) / 2 + "," + ($("#" + players[i + "-" + j][1]).height() - bbox.height) / 2,
				});
			}

			$("#field" + i + "-" + j).droppable({
				drop: function( event, ui ) {
					$( this )
					.addClass( "ui-state-highlight" )
					.html( "Dropped!" );
				},
				over: function(event, ui) {
					$( this )
					.addClass( "ui-state-highlight" )
					.html( "Hover..." );
				},
				out: function(event, ui) {
					$( this )
					.addClass( "ui-state-highlight" )
					.html( "Drop here..." );
				},
			});
		}
	}

	$(".fieldspacer").height(step / 11 * 10);
	$(".fieldspacer").width(step / 11 * 10);
	$(".player svg").height(step / 11 * 8);
	$(".player svg").width(step / 11 * 8);

/*
	$("#board").append(`
		<div id="draggable" class="ui-widget-content">
		  <p>Drag me to my target</p>
		</div>
		<div id="droppable" class="ui-widget-header">
		  <p>Drop here</p>
		</div>
	`);

	$( "#draggable" ).draggable();

	$( "#droppable" ).droppable({
		drop: function( event, ui ) {
			$( this )
			.addClass( "ui-state-highlight" )
			.find( "p" )
			.html( "Dropped!" );
		},
		over: function(event, ui) {
			$( this )
			.addClass( "ui-state-highlight" )
			.find( "p" )
			.html( "Hover..." );

			$("#draggable").draggable({
				grid: [50, 50]
			});
		},
		out: function(event, ui) {
			$( this )
			.addClass( "ui-state-highlight" )
			.find( "p" )
			.html( "Drop here..." );

			$("#draggable").draggable("option", "grid", false);
		},
	});
//*/

/*
// :(	https://bugs.jqueryui.com/ticket/4211	:(

	$("#redplayer1").draggable();

	$(".field40").droppable({
		over: function(event, ui) {
			$("#droppable")
			.addClass( "ui-state-highlight" )
			.find( "p" )
			.html( "Hover..." );

			$("#draggable").draggable({
				grid: [50, 50]
			});
		},
	});


/*
	$("#svg").addClass("ui-widget-header");
	$("#redplayer1").addClass("ui-widget-content");

	$("#redplayer1").draggable();

	$("#svg").droppable({
		over: function(event, ui) {
			console.log(event);
			console.log(ui);
			$("#redplayer1").draggable({
				grid: [
					40, 40
				],
			});
		},
		out: function(event, ui) {
			$("#redplayer1").draggable("option", "grid", false);
		}
	});

//					$("#svg").width() / 10,
//					$("#svg").width() / 10,

//*/
}

function getPlayerPath(step) {
	var data = "M 0.55127468,2.6302667 0.01493222,2.6282667 0.01393618,2.454828 C 0.0129099,2.276012 0.01430632,2.2443013 0.02654046,2.1686271 0.06605833,1.9241661 0.2003231,1.5289706 0.39966503,1.0703341 0.42540283,1.01115 0.45231567,0.94994436 0.45949211,0.93436616 0.46661362,0.91882768 0.47188028,0.90507051 0.47108188,0.90388277 0.47028667,0.90289712 0.45535913,0.89270286 0.43790948,0.88161794 0.38298162,0.84687889 0.32306918,0.7966011 0.28490885,0.75329092 0.24912476,0.71271235 0.2150673,0.6565952 0.19623642,0.6073566 0.16675448,0.53025733 0.1621142,0.43171082 0.18322206,0.33075931 c 0.0331726,-0.15863243 0.13508705,-0.25997987 0.30121222,-0.299539 0.060313,-0.01435095 0.1124479,-0.01890369 0.19693,-0.01722114 0.1101969,0.0019795 0.1732873,0.01425198 0.2468745,0.04711069 0.13243032,0.05908633 0.20397732,0.16364046 0.22331442,0.32624168 0.00486,0.0408755 0.00194,0.13433483 -0.00529,0.1641848 -0.031292,0.13113799 -0.12344,0.24682649 -0.26655472,0.33466416 -0.016446,0.0100951 -0.025274,0.0174192 -0.025274,0.021081 0,0.002969 0.00302,0.0120744 0.0068,0.0199923 0.01268,0.0268215 0.078561,0.1784864 0.1063165,0.2447085 0.17495602,0.4174147 0.28820412,0.7615901 0.32666132,0.992779 0.013941,0.083827 0.015031,0.1044848 0.015031,0.2864252 0,0.1530007 -6.336e-4,0.1761604 -0.00486,0.1786247 -0.00291,0.002 -0.048277,0.003 -0.1108548,0.002 -0.058289,-3.761e-4 -0.34731942,-9.898e-4 -0.64230722,-0.002 z";

	data = data.split(" ");

	var round = 8

	for (i = 0; i < data.length; ++i) {
		if (data[i].length != 1) {
			var nums = data[i].split(",");

			data[i] = Math.round(parseFloat(nums[0]) / 1.33334 * step / 2 * 0.7 * Math.pow(10, round)) / Math.pow(10, round) + "," +  Math.round(parseFloat(nums[1]) / 2.65001 * step * 0.7 * Math.pow(10, round)) / Math.pow(10, round);
		}
	}

	return data.join(" ");
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
