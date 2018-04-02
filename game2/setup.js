function getAvatars() {
	var data = [];

	$.each(
	[
		"amber","aqua","blue","light-blue","brown","cyan","blue-grey","green","light-green","indigo","khaki","lime","orange","deep-orange","pink","purple","deep-purple","red","sand","teal","yellow","white","black","grey","light-grey","dark-grey","pale-red","pale-green","pale-yellow","pale-blue",
	], function(k, v) {
		data.push([
			v,
			"w3-" + v,
		]);
	});

	return data;
}
