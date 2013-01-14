var User, Station = require('./station').Station, Levels;

User = (function () {
	var station = new Station();

	return function (options) {
		this.options = options || {};
		station.user = this;

		this.stations = function () {
			return [station];
		}

		this.find_station = function () {
			return station;
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