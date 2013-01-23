var User, Station = require('./station').Station, Levels;

User = (function () {
	var _stations = [];

	return function (options) {
		this.options = options || {};

		this.createStation = function (seed) {
			var station = new Station({seed:seed});
			station.user = this;

			_stations.push(station);
			station.id = _stations.indexOf(station);

			return station;
		}

		this.stations = function () {
			return _stations;
		}

		this.find_station = function (index) {
			console.log(_stations[index].id);
			return _stations[index];
		}

	}
}());

User.find = (function () {
	var user = new User();

	return function (user_id) {
		return user;
	}

}());


exports.User = User;