var Station = function (options) {
	this.options = options;

	this.build = function () {
		return this.options.sc.get("/users/" + this.options.seed + "/tracks", {});
	}

}

Station.seed = function (user, sc) {

	var station = new Station({
		seed: user,
		sc: sc
	});

	return station.build(station);

}

exports.Station = Station;