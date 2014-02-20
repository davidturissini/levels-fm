var pigeon = require('pigeon');
var Station = require('./Station');
var backbone = require('backbone');

var User = backbone.Model.extend({

	initialize: function () {
		this._stations = [];
	},

	stations:function () {
		var user = this;
		var username = this.get('username');

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

});


module.exports = User;