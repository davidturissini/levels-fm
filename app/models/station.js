var Station = function (options) {
	var Track = require('./track').Track, _tracks = [], q = require('q'), sc = require('./../../lib/soundcloud').sc;

	this.options = options || {};

	this.addTracks = function (tracks) {
		tracks.forEach(function (track) {
			if (track.duration <= 600000) {
				_tracks.push(track);
			}
		})

		console.log(_tracks.length)
	}

	this.build = function (deferred) {
		var station = this;

		sc.get('/users/dave-airborne/tracks').then(function (tracks) {

			sc.get('/users/dave-airborne/followings').then(function (users) {
				var usersProcessed = 0;

				users.forEach(function (user) {
					sc.get('/users/' + user.permalink + '/tracks').then(function (tracks) {
						station.addTracks(tracks);
						usersProcessed += 1;

						if (usersProcessed === users.length) {
							deferred.resolve(station.getRandomTrack());
						}

					})
				})

			});

		});

	}

	this.getRandomTrack = function () {
		return _tracks[Math.floor(Math.random() * _tracks.length)];;
	}

	this.pickTrack = function () {
		var deferred = q.defer();

		if (_tracks.length === 0) {
			this.build(deferred);
		} else {
			setTimeout(function () {
				deferred.resolve(this.getRandomTrack());
			}.bind(this), 0);
		}
		
		return deferred.promise;

	}

}

Station.seed = function (user, sc) {

	var station = new Station({
		seed: user,
		sc: sc
	});

	return station.build(station);

}

exports.Station = Station;