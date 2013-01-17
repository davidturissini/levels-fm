var User, Station = require('./station').Station, Levels;

User = (function () {
	var _stations = [];

	return function (options) {
		this.options = options || {};

		this.createStation = function (seed) {
			return new Station.createAndSeed(seed)

				.then(function (station) {
					station.user = this;

					_stations.push(station);
					station.id = _stations.indexOf(station);

					return station;
				})
		}

		this.stations = function () {
			return _stations;
		}

		this.find_station = function (index) {
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