var jquery = require('jquery');

function StationList (element, tuner) {
	this._element = element;
	this._tuner = tuner;

	this._tuner.on('stations:changed', this._onStationsChange.bind(this));
	this._tuner.on('stations:add', this._onStationsAdd.bind(this));
	this._tuner.on('stations:remove', this._onStationsRemove.bind(this));

}

StationList.prototype = {

	_appendStationUI: function (station) {
		var stationEl = document.createElement('div');
		stationEl.setAttribute('data-station_id', station.id);
		stationEl.classList.add('station');
		var title = document.createElement('h1');
		title.innerHTML = station.get('title');
		title.classList.add('station-title');
		title.setAttribute('data-station_id', station.id);
		stationEl.appendChild(title);


		var del = document.createElement('span');
		del.classList.add('station-delete');
		del.setAttribute('data-station_id', station.id);
		del.innerHTML = 'delete';
		stationEl.appendChild(del);
		this._element.appendChild(stationEl);
	},

	_onStationsRemove: function (station) {
		var stationDeleteEl = this._element.querySelector('[data-station_id="' + station.id + '"]');
		stationDeleteEl.parentNode.parentNode.removeChild(stationDeleteEl.parentNode);
	},

	_onStationsAdd: function (station) {
		this._appendStationUI(station);
	},

	_onStationsChange: function (stations) {
		jquery(this._element).empty();
		stations.each(this._appendStationUI, this);
	}

};

module.exports = StationList;