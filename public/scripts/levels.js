jQuery(function () {
	'use strict';

	jQuery.ajax({
		url: "/config",
		contentType: "json"
	})

	.then(function (config) {
		var player;

		player = new Levels.Player({
			config:config
		}).render();

		document.getElementById('make-station').addEventListener('click', function () {

			jQuery.ajax({
				url: '/users/1/stations',
				type: 'post',
				dataType: 'json',
				data: {
					seed: document.getElementById('station-seed').value
				}
			})

			.then(function (stationJSON) {
				var station = new Levels.Station(stationJSON);
				player.setStation(station);
			})

		})

	})

});