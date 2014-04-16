if (typeof document === 'undefined') {
	return;
}

var levelsfm = require('./../services/levelsfm');
var Stations = require('./../collection/Stations');
var backbone = require('backbone');
var cookies = require('jakobmattsson-client-cookies');
var anonymousUser;
var currentUser = null;
var q = require('q');


var User = backbone.Model.extend({

	initialize: function () {
		this._stations = new Stations();
		
		this._stations.on('add', function (model) {
			model.user = this;
		}, this);

		this.__updateStationsUrl();

		this.on('login_status_change', this.__updateStationsUrl, this);
		
	},

	__updateStationsUrl: function () {
		if (this.isLoggedIn()) {
			this._stations.url = levelsfm.domain + '/users/' + this.get('username') + '/stations';
		} else {
			this._stations.url = '';
		}
	},

	destroyCookie: function () {
		cookies.set('user', undefined);
		this.clear();
		this.set(User.anonymous().attributes);
	},

	logout: function () {
		var user = this;
		return levelsfm.post('/logout', {
			username:this.get('username'),
			token:this.get('token')
		})
		.then(function () {
			user.destroyCookie();
			user.trigger('login_status_change', {
				user:user
			});
		});
	},

	isAnonymous: function () {
		return (this.get('username') === '__anon');
	},

	isLoggedIn: function () {
		return (typeof this.get('token') === 'string');
	},

	verifyLoggedIn: function () {
		var defer;

		if (this.isAnonymous()) {
			defer = q.defer();
			defer.resolve(false);
			return defer.promise;
		}

		return levelsfm.get('/users/' + this.get('username') + '/verify/token/' + this.get('token'))
			.then(function (response) {
				return response.verified;
			});
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
	return currentUser;
};

User.register = function (username, password, confirm) {
	return levelsfm.post('/users', {
		username:username,
		password:password,
		confirm:confirm
	})

	.then(function (e) {
		return User.login(username, password);
	})
}

User.login = function (username, password) {
	return levelsfm.post('/login', {
		username:username,
		password:password
	})

	.then(function (userData) {
		if (userData.error) {
			throw new Error(userData.error);
		}

		currentUser.clear();
		currentUser.set(userData);
		cookies.set('user', {
			username:currentUser.get('username'),
			token:currentUser.get('token')
		});

		currentUser.trigger('login_status_change', {
			user:currentUser
		});
		
		return currentUser;
	});
}

userData = cookies.get('user');
if (userData) {
	currentUser = new User(userData);
} else {
	currentUser = User.anonymous();
}


module.exports = User;