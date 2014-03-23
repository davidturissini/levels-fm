var levelsfm = require('./../services/levelsfm');
var Stations = require('./../collection/Stations');
var backbone = require('backbone');
var cookies = require('jakobmattsson-client-cookies');
var anonymousUser;
var currentUser = null;

var User = backbone.Model.extend({

	initialize: function () {
		this._stations = new Stations();
		this._stations.url = levelsfm.domain + '/users/' + this.get('username') + '/stations';
		this._stations.on('add', function (model) {
			model.user = this;
		}, this);
	},

	identify: function () {
		var cookieJar = new Cookies();
		
	},

	logout: function () {
		var user = this;
		return levelsfm.post('/logout', {
			username:this.get('username'),
			token:this.get('token')
		})
		.then(function () {
			cookies.set('user', undefined);
			user.clear();
			user.set(User.anonymous().attributes);
		});
	},

	isAnonymous: function () {
		return (this.get('username') === '__anon');
	}

});


Object.defineProperties(User.prototype, {

	'stations': {

		get: function () {
			return this._stations;
		}

	}

});

User.anonymous = function () {
	if (!anonymousUser) {
		anonymousUser = new User({
			username:'__anon'
		});
	}

	return anonymousUser;
}

User.current = function () {
	var user = currentUser;
	var userData;

	if (user === null) {
		userData = cookies.get('user');
		if (userData) {
			user = new User(userData);
		} else {
			user = User.anonymous();
		}

		currentUser = user;
	}

	return user;
};

User.login = function (username, password) {
	return levelsfm.post('/login', {
		username:username,
		password:password
	})

	.then(function (userData) {
		if (userData.error) {
			throw new Error(userData.error);
		}

		var user = new User(userData);
		cookies.set('user', {
			username:user.get('username'),
			token:user.get('token')
		});
		
		return user;
	});
}


module.exports = User;