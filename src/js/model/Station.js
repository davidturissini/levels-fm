var pigeon = require('pigeon');

function Station (user, attributes) {
	this._user = user;
	this._attributes = attributes;
}


Station.prototype = {

	tracks: function () {
		var user = this._user;
		var stationId = this._attributes._id;

		return {

			next: function () {
				return pigeon.get('http://localhost:3000/users/' + user._attributes.username + '/stations/' + stationId + '/tracks/next')
					.then(function (e) {
						return JSON.parse(e);
					});
			}

		}

	}

};


module.exports = Station;