var sc = require('./../../../lib/soundcloud').sc, q = require('q');

var User = function (options) {
	this.options = options;

	this.permalink = this.options.permalink;

	this.tracks = function () {
		return sc.get('/users/' + this.options.permalink + '/tracks');
	}

	this.followings = function () {
		return sc.get('/users/' + this.permalink + '/followings');
	}

	this.graph = function (options) {

		options = options || {};
		options.depth = options.depth || 5;

		return UserCollection.getFollowingsFromUser({
			user: this,
			depth: options.depth
		});
	}

}

var UserCollection = function () {
	var _users = [];

	this.length = function () {
		return _users.length;
	}

	this.add = function (user) {
		_users.push(user);
	}

	this.tracks = function () {
		var _tracks = [], usersProcessed = 0, deferred = q.defer();


		_users.forEach(function (user) {
			sc.get('/users/' + user.permalink + '/tracks').then(function (tracks) {
				_tracks = _tracks.concat(tracks);
			}).then(function () {
				usersProcessed += 1;
				if (usersProcessed === _users.length) {
					deferred.resolve(_tracks);
				}
			})

			

		});

		return deferred.promise;
	}

}

UserCollection.getFollowingsFromUser = function (options) {
	var collection = new UserCollection(), deferred = q.defer(), discovered = [options.user];

	function exploreNodes() {
		var user = discovered.shift();

		collection.add(user);
		if (collection.length() > 100) {
			deferred.resolve(collection);
			return;
		}

		user.followings()
			.then(function (users) {
				users.forEach(function (user) {
					discovered.push(new User(user));
					if (collection.length() <= 100) {
						exploreNodes();
					}
				})
			});

	}

	exploreNodes();

	return deferred.promise;
};

exports.user = User;

