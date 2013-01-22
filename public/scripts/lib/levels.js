var Levels = (function () {
	var _player, _config;

	function init() {

		jQuery(function () {

			jQuery.ajax({
				url: "/config",
				contentType: "json"
			})

			.then(function (config) {
				_config = config;

				Levels.initPlayer();

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

						station.nextTrack()
						.then(function (track) {
							Levels.player().setTrack(track);
							Levels.player().play();
						})
					})

				})

			})

		});
	}

	init();

	return {

		initPlayer: function () {
			_player = new Levels.Player({
				config:_config
			}).render(document.getElementById('container'));
		},

		player: function () {
			return _player;
		}

	}

}())