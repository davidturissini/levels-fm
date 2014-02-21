var Track = require('./Track');
var levelsfm = require('./../services/levelsfm');

function Station (user, attributes) {
	this._user = user;
	this._attributes = attributes;
}


Station.prototype = {

	destroy: function () {
		var user = this._user;
		var stationId = this._attributes._id;

		return levelsfm.del('/users/' + user.get('username') + '/stations/' + stationId);
	},

	tracks: function () {
		var user = this._user;
		var stationId = this._attributes._id;

		return {

			next: function () {
				return levelsfm.get('/users/' + user.get('username') + '/stations/' + stationId + '/tracks/next')
					.then(function (e) {
						return new Track(e);
					});
			}

		}

	},

	voteUp: function (track) {
		var user = this._user;
		var stationId = this._attributes._id;

		return levelsfm.get('/users/' + user.get('username') + '/stations/' + stationId + '/tracks/up/' + track.id);
	}

};


module.exports = Station;