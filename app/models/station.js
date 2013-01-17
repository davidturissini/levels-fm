var Station = function (options) {
	var Soundcloud = require('./../../lib/soundcloud').Soundcloud, Track = require('./track').Track, _users = new Soundcloud.UsersCollection(), _tracks = new Soundcloud.TracksCollection(), q = require('q');

	this.options = options || {};

	this.addTracks = function (tracks) {
		_tracks.merge(tracks);
		_tracks.reject(function (track) {
			return track.get('duration') >= 600000;
		})

		_tracks.sortByPlaybackCount();
		_tracks.trim(5000);
	}

	this.addUser = function (user) {
		var defer = q.defer(), station = this;

		_users.add(user);
		return user.tracks({
				'filter': 'streamable',
				'duration[from]': 120000,
				'duration[to]': 600000
			})
			.then(function (tracks) {
				station.addTracks(tracks);

				return user;
			});
	}

	this.build = function () {
		var station = this;

		return this.seedUser().connections()

			.then(function (connections) {
				var users, reducedCollection = new Soundcloud.UsersCollection(), usersLimit = 500;

				connections.sortByFollowers();

				users = connections.users().length > usersLimit ? connections.users().slice(0, usersLimit) : connections.users();
				reducedCollection.addUsers(users);

				reducedCollection.each(function (user) {
					station.addUser(user);
				})

			})

	}

	this.seedUser = function () {
		return new Soundcloud.User({
			permalink: 'bencoda'
		});
	}

	this.pickTrack = function () {
		var deferred = q.defer(), station = this;

		if (_tracks.length() === 0) {

			this.addUser(this.seedUser())

				.then(function () {
					deferred.resolve(_tracks.random());
				})

				.then(function () {
					station.build();
				})


		} else {
			deferred.resolve(_tracks.random());
		}
		
		return deferred.promise;

	}

}

exports.Station = Station;