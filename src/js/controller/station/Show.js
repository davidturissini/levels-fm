var Station = require('./../../model/Station');

function StationShowController (data) {
	this._data = data;

	this._station = new Station({
		_id:data.station_id
	});
}

StationShowController.prototype = {

	getStation: function () {
		return this._station;
	},

	getTemplateData: function () {
		return {
			station:this._station.attributes
		}
	}

};

StationShowController.create = function (routeData) {
	return new StationShowController(routeData);
};

module.exports = StationShowController;