var levelsfm = require('./../services/levelsfm');
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

				return levelsfm.get('/users/' + username + '/stations')
					.then(function (stationsData) {
						var stations = [];


						stationsData.forEach(function (stationData) {
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