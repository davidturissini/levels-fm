var levelsfm = require('./../services/levelsfm');
var Stations = require('./../collection/Stations');
var backbone = require('backbone');
var cookies = require('jakobmattsson-client-cookies');
var anonymousUser;
var currentUser = null;


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
	})

	.fail(function (err) {
		console.error(err.stack);
	})
}

userData = cookies.get('user');
if (userData) {
	currentUser = new User(userData);
} else {
	currentUser = User.anonymous();
}


module.exports = User;