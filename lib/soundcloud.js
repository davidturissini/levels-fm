var Levels = require('./levels').levels, querystring = require('querystring'), http = require('http'), q = require('q');

var Soundcloud = {
	api: function (path, requestOptions) {

		var deferred = q.defer(), options = requestOptions || {}, url, baseUrl = 'api.soundcloud.com';
		
		options.client_id = GLOBAL.CONFIG.soundcloud.client_id;
		url = 'http://' + baseUrl + path + '.json?' + querystring.stringify(options);

		http.get(url, function (resp) {
			var data = '';

			resp.on('data', function (chunk) {
				data += chunk;
			});

			resp.on('end', function(){
				var json = JSON.parse(data);

				deferred.resolve(json);
			})
		});

		return deferred.promise;
		
	}
};

Soundcloud.TracksCollection = Levels.Class({
	_tracks: [],

	add: function (track) {
		this._tracks.push(track);
	},

	each: function (func) {
		this._tracks.forEach(func);
	},

	random: function () {
		return this._tracks[Math.floor(Math.random() * this.length())];;
	},

	length: function () {
		return this._tracks.length;
	},

	sort: function (func) {
		this._tracks.sort(func);
	},

	trim: function (length) {
		this._tracks = this._tracks.slice(0, length);
	},

	tracks: function () {
		return this._tracks;
	},

	merge: function (tracks) {
		this._tracks = this._tracks.concat(tracks.tracks());
	},

	reject: function (func) {
		var _t = [];

		this._tracks.forEach(function (track) {
			if (!func(track)) {
				_t.push(track);
			}
			
		})

		this._tracks = _t;
	},

	sortByPlaybackCount: function () {
		this.sort(function (t1, t2) {
			return (t1.get('playback_count') < t2.get('playback_count')) ? 1 : -1;
		})
	},

	addTracks: function (tracksArray) {
		tracksArray.forEach(function (_track) {
			if (_track instanceof Soundcloud.Track) {
				this.add(_track);
			} else {
				this.add(new Soundcloud.Track(_track));
			}
		}.bind(this))
	}

})

Soundcloud.UsersCollection = Levels.Class({
	_users: [],

	length: function () {
		return this._users.length;
	},

	contains: function (user) {
		return !(this._users.indexOf(user) === -1);
	},

	users: function () {
		return this._users;
	},

	addUsers: function (usersArray) {
		var i;
		
		for (i = 0; i < usersArray.length; i += 1) {
			this.add(usersArray[i]);
		}
		
	},

	merge: function (collection) {
		this._users = this._users.concat(collection.users());
	},

	sort: function (func) {
		this._users.sort(func);
	},

	sortByFollowers: function () {
		this.sort(function (user1, user2) {
			return (user1.get('followers_count') < user2.get('followers_count')) ? 1 : -1;
		})
	},

	each: function (func) {
		this._users.forEach(func);
	},

	add: function (user) {
		this._users.push(user);
	},

	tracks: function () {
		var graph = this, _tracks = new Soundcloud.TracksCollection(), usersProcessed = 0, deferred = q.defer();


		this._users.forEach(function (user) {


			Soundcloud.api('/users/' + user.get('permalink') + '/tracks')

				.then(function (tracksJSON) {
					_tracks.addTracks(tracksJSON);

				})

				.then(function () {
					usersProcessed += 1;

					if (usersProcessed === graph._users.length) {
						deferred.resolve(_tracks);
					}
				})

		});

		return deferred.promise;
	}

});

Soundcloud.User = Levels.Class({

	tracks: function (options) {
		options = options || {};

		return Soundcloud.api('/users/' + this.get('permalink') + '/tracks', options)
			.then(function (tracksJSON) {
				var tracks = new Soundcloud.TracksCollection();
				tracks.addTracks(tracksJSON);

				return tracks;
			});
	},

	followings: function () {
		return Soundcloud.api('/users/' + this.get('permalink') + '/followings')
			.then(function (followingsJSON) {
				var followings = new Soundcloud.UsersCollection();

				followingsJSON.forEach(function (followingJSON) {
					var follower = new Soundcloud.User(followingJSON);
					followings.add(follower);
				});

				return followings;

			});
	},

	followers: function () {
		return Soundcloud.api('/users/' + this.get('permalink') + '/followers')
			.then(function (followersJSON) {
				var followers = new Soundcloud.UsersCollection();

				followersJSON.forEach(function (userJSON) {
					var follower = new Soundcloud.User(userJSON);
					followers.add(follower);
				});

				return followers;

			});
	},

	connections: function () {
		var user = this, users = new Soundcloud.UsersCollection();

		return this.followings()

			.then(function (followings) {
				users.merge(followings);

				return user.followers();
			})

			.then(function (followers) {
				users.merge(followers);

				return users;
			})

	},

	graph: function (options) {

		options = options || {};
		options.depth = options.depth || 5;

		return Soundcloud.Graph.getFollowingsFromUser({
			user: this,
			depth: options.depth
		});
	}

});

Soundcloud.Track = Levels.Class({
	toJSON: function () {
		return JSON.stringify(this.attributes);
	}
})

exports.Soundcloud = Soundcloud;