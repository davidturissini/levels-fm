var Station = function (options) {
	var Soundcloud = require('./../../lib/soundcloud').Soundcloud, Track = require('./track').Track, _users = new Soundcloud.UsersCollection(), _tracks = new Soundcloud.TracksCollection(), q = require('q'),
	_seedUser = new Soundcloud.User({
			permalink: options.seed
		});

	this.options = options || {};

	this.toJSON = function () {
		return JSON.stringify({
			id:this.id
		})
	}

	this.tracks = function () {
		return _tracks;
	}

	this.addTracks = function (tracks) {
		_tracks.merge(tracks);
		_tracks.sortByPlaybackCount();
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

		return this.addUser(this.seedUser())

			.then(function (user) {
				return user.connections();
			})

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
		return _seedUser;
	}

	this.pickTrack = function () {
		var deferred = q.defer(), station = this;
		deferred.resolve(_tracks.random());
		return deferred.promise;

	}

}

Station.createAndSeed = function (seed) {
	var station = new Station({seed:seed});
	return station.addUser(station.seedUser())
		.then(function (user) {
			return station;
		});
}

exports.Station = Station;