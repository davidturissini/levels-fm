var Track = require('./Track');
var levelsfm = require('./../services/levelsfm');
var backbone = require('backbone');
var soundcloud = require('soundcloud').soundcloud;

var Station = backbone.Model.extend({
	idAttribute:'_id',

	url:function () {
		return levelsfm.domain + '/stations/' + this.id;
	},

	sync: function (method, model, options) {
		if(method === 'delete') {

			if (!this._user) {
				throw new Error('Could not delete station. No user was specified');
			}

			options.url = levelsfm.domain + '/users/' + this._user.get('username') + '/stations/' + this.id;
			options.url += '/token/' + this._user.get('token');

		} else {
			options.url = model.url();
		}

		return backbone.sync(method, model, options);
	},

	tracks: function () {
		var stationId = this.id;

		return {

			next: function () {
				return levelsfm.get('/stations/' + stationId + '/tracks/next')
					.then(function (trackReference) {
						return soundcloud.api('/tracks/' + trackReference.id);
					})

					.then(function (e) {
						return new Track(e);
					})
			}

		}

	},

	voteUp: function (track) {
		return levelsfm.post('/users/' + this._user.get('username') + '/stations/' + this.id + '/tracks/up/' + track.id, {
			token:this._user.get('token')
		});
	},


	voteDown: function (track) {
		return levelsfm.del('/users/' + this._user.get('username') + '/stations/' + this.id + '/tracks/' + track.id + '/token/' + this._user.get('token'));
	}

});

Object.defineProperties(Station.prototype, {
	user:{
		get: function () {
			return this._user;
		},

		set: function (user) {
			this._user = user;
		}
	}
})

Station.create = function (user, artistPermalink) {
	return levelsfm.post('/users/' + user.get('username') + '/stations/' + artistPermalink, {
		token:user.get('token')
		})
	
		.then(function (stationData) {
			return new Station(stationData);
		});
}


module.exports = Station;