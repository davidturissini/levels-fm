var Soundcloud = require('./../../lib/soundcloud').Soundcloud, Track = require('./track').Track, _users = new Soundcloud.UsersCollection(), _tracks = new Soundcloud.TracksCollection(), q = require('q');

var Station = function (options) {
	this._seedUser = new Soundcloud.User({
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

	this.addUsers = function (users) {
		var station = this;

		users.each(function (user) {
			station.addUser(user);
		})
	}

	this.addUser = function (user) {
		var station = this;
		_users.add(user);

		return user.tracks({
				'filter': 'streamable',
				'duration[from]': 180000,
				'duration[to]': 600000
			})

			.then(function (tracks) {
				station.addTracks(tracks);
				return user;
			});
	}

	this.seed = function () {
		var station = this;
		return this.seedUser().sync()

			.then(function (user) {
				return station.addUser(user);
			})

			.then(function () {
				return station;
			})
	}

	this.build = function () {
		var station = this;

		if (station.seedUser().hasFollowings()) {
			station.seedUser()
				.followings({}, function (followings) {
					station.addUsers(followings);
				})
		}

		if (!station.seedUser().hasFollowings()) {
			station.seedUser()
			.followers()
			.then(function (followers) {
				station.addUsers(followers);
			});

		}

	}

	this.seedUser = function () {
		return this._seedUser;
	}

	this.pickTrack = function () {
		var deferred = q.defer(), station = this, track = _tracks.random();

		deferred.resolve(track);

		return deferred.promise;
	}

}

exports.Station = Station;