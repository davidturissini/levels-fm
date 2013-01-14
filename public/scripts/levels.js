jQuery(function () {
	'use strict';

	jQuery.ajax({
		url: "/config",
		contentType: "json"
	}).then(function (config) {
		var player;

		player = new Player({
			config:config
		}).render();

		getNextTrack(player);
		jQuery(player.el).on('ended', function (e) {
			
			if (player.trackPercent() > 50) {
				getNextTrack();
			}

		})

	})

});

function getNextTrack(player) {

	jQuery.ajax({
		url: "/song",
		contentType: "json"
	}).then(function (trackJSON) {
		var track = new Soundcloud.Track(trackJSON);

		player.setTrack(track);
		player.play();

	})
}