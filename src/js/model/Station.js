var pigeon = require('pigeon');
var Track = require('./Track');

function Station (user, attributes) {
	this._user = user;
	this._attributes = attributes;
}


Station.prototype = {

	destroy: function () {
		var user = this._user;
		var stationId = this._attributes._id;

		return pigeon.get('http://localhost:3000/users/' + user._attributes.username + '/stations/' + stationId + '/destroy')
			.then(function (e) {
				return JSON.parse(e);
			});
	},

	tracks: function () {
		var user = this._user;
		var stationId = this._attributes._id;

		return {

			next: function () {
				return pigeon.get('http://localhost:3000/users/' + user._attributes.username + '/stations/' + stationId + '/tracks/next')
					.then(function (e) {
						return new Track(JSON.parse(e));
					});
			}

		}

	},

	voteUp: function (track) {
		var user = this._user;
		var stationId = this._attributes._id;

		return pigeon.get('http://localhost:3000/users/' + user._attributes.username + '/stations/' + stationId + '/tracks/up/' + track._attributes._id)
			.then(function (e) {
				return JSON.parse(e);
			});
	}

};


module.exports = Station;