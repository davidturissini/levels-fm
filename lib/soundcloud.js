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
		
	},

	resource: function (path, total, requestOptions, progressFunc) {
		var limit = 200, pages = Math.ceil(total / limit), results = [], i, offset, funcs = [], options;

		for(i = 0; i < pages; i += 1) {
			offset = i * limit;

			if (offset > 8000) {
				i = pages;
			} else {
				options = Levels.Object.extend(requestOptions, {
					limit:limit,
					offset:offset
				});

				funcs.push(Soundcloud.api(path, options)
					.then(function (_results) {
						results = results.concat(_results);

						if (typeof progressFunc === 'function') {
							progressFunc(_results);
						}
					}))
			}
		}

		return q.all(funcs)
			.then(function (r) {
				return results;
			});

	}

};

Soundcloud.TracksCollection = Levels.Class({
	_tracks: [],

	add: function (track) {
		if(this._tracks.indexOf(track) === -1) {
			this._tracks.push(track);
		}
	},

	each: function (func) {
		this._tracks.forEach(func);
	},

	random: function () {
		var randIndex = Math.floor(Math.random() * this.length());
		return this._tracks[randIndex];
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
		this.addTracks(tracks.tracks());
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
			var track;
			if (_track instanceof Soundcloud.Track) {
				track = _track;
			} else {
				track = new Soundcloud.Track(_track);
			}

			this.add(track);

		}.bind(this))
	}

})

Soundcloud.UsersCollection = Levels.Class({
	_users: [],

	initialize: function (initData) {
		if (initData) {
			initData.forEach(function (userJSON) {
				var user = new Soundcloud.User(userJSON);
				this.add(user);
			}.bind(this));
		}
	},

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
		this.addUsers(collection.users());
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
		if(this._users.indexOf(user) === -1) {
			this._users.push(user);
		}
	}

});

Soundcloud.User = Levels.Class({

	sync: function () {
		var user = this;

		return Soundcloud.api('/users/' + this.get('permalink'))
		.then(function (userJSON) {
			user.attributes = userJSON;

			return user;
		})
	},

	hasFollowings: function () {
		return !(this.get('followings_count') === 0);
	},

	tracks: function (options) {
		var limit = options.limit || this.get('track_count');
		options = options || {};

		return Soundcloud.resource('/users/' + this.get('permalink') + '/tracks', limit, options)
			.then(function (tracksJSON) {
				var tracks = new Soundcloud.TracksCollection();
				tracks.addTracks(tracksJSON);
				return tracks;
			});
	},

	followings: function (options, progressFunc) {
		var limit = options.limit || this.get('followings_count');
		options = options || {};


		function progress(followingsJSON) {
			if (typeof progressFunc === 'function') {
				progressFunc(new Soundcloud.UsersCollection(followingsJSON));
			}
		}

		return Soundcloud.resource('/users/' + this.get('permalink') + '/followings', limit, options, progress)
			.then(function (followingsJSON) {
				return new Soundcloud.UsersCollection(followingsJSON);
			});
	},

	followers: function (option, progressFunc) {
		var limit = options.limit || this.get('followers_count');
		options = options || {};

		function progress(followersJSON) {
			if (typeof progressFunc === 'function') {
				progressFunc(new Soundcloud.UsersCollection(followersJSON));
			}
		}

		return Soundcloud.resource('/users/' + this.get('permalink') + '/followers', limit, options, progress)
			.then(function (followersJSON) {
				return new Soundcloud.UsersCollection(followersJSON);
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