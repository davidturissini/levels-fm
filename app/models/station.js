var Station = function (options) {
	var SCUser = require('./soundcloud/user').user, Track = require('./track').Track, _tracks = [], q = require('q'), sc = require('./../../lib/soundcloud').sc;

	this.options = options || {};

	this.addTracks = function (tracks) {
		tracks.forEach(function (track) {
			if (track.duration <= 600000 && track.streamable === true) {
				_tracks.push(track);
			}
		})

	}

	this.build = function (deferred) {
		var station = this, scUser;

		scUser = new SCUser({
			permalink: 'dave-airborne'
		});

		scUser.graph({
			depth:3

		}).then(function (followings) {
			followings.tracks().then(function (tracks) {
				station.addTracks(tracks);
				deferred.resolve(station.getRandomTrack());
			})

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