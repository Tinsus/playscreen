function toogleAccordion(id) {
	$("#" + id).toogleClass("w3-show");
}

function setupGallery(container) {
	$("#" + container).html("");
	$("#" + container).addClass("w3-display-container w3-black w3-card-4");

	$.each(slides[container]["json"], function (k, v) {
		$("#" + container).append(`
			<img class="w3-display-middle w3-animate-opacity w3-hide img` + container + `" id="img` + container + k + `" src="` + GetDomain() + `img/slideshow/` + v + `" alt="` + GetLoca("IMG" + container + k) + `" onclick="window.open($(this).attr('src'))"/>
		`);
	});

	if ($("#" + container).parent().width() < 600) {
		$("#" + container).css("width", $("#" + container).parent().width());
		$("#" + container).css("height", $("#" + container).parent().width() / 6 * 4);
	} else if ($("#" + container).parent().width() * 0.8 < 900) {
		$("#" + container).css("width", $("#" + container).parent().width() * 0.8);
		$("#" + container).css("height", $("#" + container).parent().width() / 6 * 4 * 0.8);
	} else {
		$("#" + container).css("width", $("#" + container).parent().width() * 0.5);
		$("#" + container).css("height", $("#" + container).parent().width() / 6 * 4 * 0.5);
	}

	$("#" + container).parent().css("margin-left", (window.innerWidth - $("#" + container).width()) / 2 - 16);

	$("#" + container).append(`
		<div id="imgtag` + container + `" class="w3-display-topright w3-large w3-container padding-8 w3-theme-d2">
			` + GetLoca("AJAX_LOADING") + `
		</div>
		<div id="imgnav` + container + `" class="w3-center w3-display-bottomleft w3-container padding-4 w3-text-green" style="width: 100%">
			<i class="w3-left fa fa-2x fa-arrow-left" style="cursor: pointer;" onclick="changeDivs(-1, '` + container + `')"></i>
			<i class="w3-right fa fa-2x fa-arrow-right" style="cursor: pointer;" onclick="changeDivs(1, '` + container + `')"></i>
		</div>
	`);

	$.each(slides[container]["json"], function (k, v) {
		$("#imgnav" + container).append(`
			<span class="w3-badge dot` + container + ` w3-border" style="cursor: pointer; height: 13px; width: 13px; padding: 0px;" onclick="currentDiv(` + k + `, '` + container + `')" id="dot` + container + k + `"></span>
		`);
	});
}

function resizeGallery(container) {
	$("#" + container + " img").each(function(i) {
		var ratio = $(this)[0].naturalWidth / $(this)[0].naturalHeight;

		if (ratio > 6 / 4) {
			$(this).css("width", $("#" + container).width());
			$(this).css("height", $("#" + container).width() / ratio);
		} else {
			$(this).css("width", $("#" + container).height() * ratio);
			$(this).css("height", $("#" + container).height());
		}
	});
}

function changeDivs(change, container) {
	if (change < 0) {
		slides[container]["index"]--;
	} else {
		slides[container]["index"]++;
	}

	if (slides[container]["index"] < 0) {
		slides[container]["index"] = slides[container]["json"].length - 1;
	} else if (slides[container]["index"] > slides[container]["json"].length - 1) {
		slides[container]["index"] = 0;
	}

	currentDiv(slides[container]["index"], container);
}

var timer = {};

function currentDiv(id, container) {
	$(".img" + container).addClass("w3-hide");
	$(".dot" + container).removeClass("w3-green");

	$("#img" + container + id).removeClass("w3-hide");
	$("#dot" + container + id).addClass("w3-green");

	$("#imgtag" + container).html(GetLoca("IMG" + container + id));

	timer[container] = 0;
}

function galleryDia(container) {
	if (timer[container] >= 7) {
		changeDivs(1, container);
	}

	timer[container] += 0.1;

	setTimeout(function() {
		galleryDia(container)
	}, 100);
}
