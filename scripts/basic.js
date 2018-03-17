function AjaxError(bool) {
	if (bool) {
		$("#ajaxerror").fadeOut();

		resizeSpacer();
	} else {
		$("#ajaxerror").fadeIn();
	}
}

function resizeSpacer() {
	if ($("#spacer").height() - $("#header").height() > 2 || $("#spacer").height() - $("#header").height() < 0) {
		$("#spacer").animate({
			height: $("#header").height(),
		}, {
			duration: 100 + ($("#spacer").height() - $("#header").height()) * 2,
			easing: "linear",
			queue: false,
			complete: function() {
				setTimeout(resizeSpacer, 50);
			},
		});
	}

	$("#pagecontent").css("min-height", $(window).height() - $("#footer").height() - $("#header").height());
}

var localization = [];

function SetLoca(key, string) {
	localization[key] = string;
}

function GetLoca(key) {
	if (localization[key] == undefined) {
		alert(key);
	}

	return localization[key]
}

function SetLanguage(lang) {
	$.postJSON(GetDomain() + "io/ajax.php", {
		operation: "language",
		lang: lang,
	}).done(function(data) {
		location.reload(true);

		AjaxError(true);
	}).fail(function(jqXHR, msg) {
		AjaxError(false);

		SetLanguage(lang);
	});
}

jQuery.extend({
	postJSON: function(url, data, callback) {
		return jQuery.post(url, data, callback, "json");
	}
});

function handleSmallNav() {
	$("#smallNav").toggleClass("w3-show");
	$("header").removeClass("w3-top");
	$("#spacer").remove();

	backToTop();
}

$(window).scroll(function(){
	if ($(this).scrollTop() > $(this).height() && $("body").height() - $(this).scrollTop() - $(this).height() - $("footer").height() > 1) {
		$("#scroll").fadeIn();
	} else {
		$("#scroll").fadeOut();
	}
});

function backToTop() {
	scrollTo("html");
}

function scrollTo(id) {
	if ($(id).length == 0) {
		setTimeout(function() {
			scrollTo(id);
		}, 1100);
	} else {
		$("html").animate({
			scrollTop: $(id).offset().top - $("header").height() * 2.3,
		}, 800);
	}
}

loadingCounter = 0;

function AjaxLoading(state, target) {
	switch(state) {
		case 2:
			$("#ajaxloading").show();
			AjaxError(false);

			$(target).removeClass("w3-yellow");
			$(target).addClass("w3-red");
		case 0:
		case false:
			$(target).removeClass("w3-red");
			$(target).removeClass("w3-yellow");
			$(target).addClass("w3-green");

			setTimeout(function() {
				$(target).removeClass("w3-green");
			}, 1500);

			loadingCounter--;

			break;
		default:
			$(target).addClass("w3-yellow");

			loadingCounter++;

			break;
	}

	if (loadingCounter <= 0) {
		$("#ajaxloading").hide();
		AjaxError(true);
		resizeSpacer();
	} else {
		$("#ajaxloading").show();
	}

	resizeSpacer();
}

function message(msg, color) {
	switch(color) {
		case "yellow":
		case "green":
			break;
		case "red":
			times = "black";
			break;
		default:
			color = "blue";
			break;
	};

	$("#header").append(`
		<div class="w3-panel w3-leftbar w3-rightbar w3-round w3-border w3-card-4 w3-pale-` + color + ` w3-border-` + color + ` padding-4">
			<div onclick="$(this).parent().remove(); resizeSpacer()" class="w3-button w3-hover-text-red w3-container w3-right w3-xlarge fa fa-times w3-hover-none">
			</div>
			<div>
				` + msg + `
			</div>
		</div>
	`);

	resizeSpacer();
}

function getUrlVar(get) {
	var vars = {};

	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
		vars[key] = decodeURIComponent(value);
	});

	return vars[get];
}
