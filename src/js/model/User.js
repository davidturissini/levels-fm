var pigeon = require('pigeon');
var Station = require('./Station');

function User (attributes) {
	this._attributes = attributes;
	this._stations = [];
}

User.prototype = {

	stations:function () {
		var user = this;
		var username = this._attributes.username;

		return {
			fetch:function () {

				return pigeon.get('http://localhost:3000/users/' + username + '/stations')
					.then(function (stationsData) {
						var stations = [];


						JSON.parse(stationsData).forEach(function (stationData) {

							var station = new Station(user, stationData);
							stations.push(station);
						});

						user._stations = stations;
						return stations;

					});
			}
		}

	}

};


module.exports = User;