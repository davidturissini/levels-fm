var Station = function (options) {
	var Soundcloud = require('./../../lib/soundcloud').Soundcloud, Track = require('./track').Track, _tracks = new Soundcloud.TracksCollection(), q = require('q');

	this.options = options || {};

	this.addTracks = function (tracks) {
		_tracks.merge(tracks);
		_tracks.reject(function (track) {
			return track.get('duration') >= 600000 && track.get('streamable') !== true;
		})

		_tracks.sortByPlaybackCount();

		if (_tracks.length() > 500) {
			_tracks.trim(500);
		}
	}

	this.build = function (deferred) {
		var station = this, scUser;

		scUser = new Soundcloud.User({
			permalink: 'thenotrealdeadmau5'
		});

		scUser.connections()

			.then(function (connections) {
				var users, reducedCollection = new Soundcloud.UsersCollection();
			
				connections.sortByFollowers();

				users = connections.users().length > 100 ? connections.users().slice(0, 100) : connections.users();


				reducedCollection.addUsers(users);

				return reducedCollection.tracks();
			})

			.then(function (tracks) {
				station.addTracks(tracks);
				deferred.resolve(_tracks.random());
			});

	}

	this.pickTrack = function () {
		var deferred = q.defer();

		if (_tracks.length() === 0) {
			this.build(deferred);
		} else {
			setTimeout(function () {
				deferred.resolve(_tracks.random());
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