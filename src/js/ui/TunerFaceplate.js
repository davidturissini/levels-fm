var PlayPauseButton = require('./PlayPauseButton');
var Progress = require('./Progress');
var Time = require('./TrackTime');
var SkipButton = require('./SkipButton');
var TrackMeta = require('./TrackMeta');
var VoteUpButton = require('./VoteUpButton');
var VoteDownButton = require('./VoteDownButton');

function TunerFaceplate (tuner, options) {
	options = options || {};

	this._tuner = tuner;

	
	var playPauseButton = options.playPauseButton || new PlayPauseButton(document.getElementById('playPause'), this._tuner.player);
	var progress = options.progress || new Progress(document.getElementById('progress'), this._tuner.player);
	var time = options.time || new Time(document.getElementById('time'), this._tuner.player);
	var trackMeta = options.trackMeta || new TrackMeta(document.getElementById('trackmeta'), this._tuner.player);
	var skipButton = options.skipButton || new SkipButton(document.getElementById('skip'), this._tuner);
	var voteUpButton = options.voteUpButton || new VoteUpButton(document.getElementById('voteup'), this._tuner);
	var voteDownButton = options.voteDownButton || new VoteDownButton(document.getElementById('votedown'), this._tuner.player);


	this._tuner.on('stations:changed', this._onStationsChange.bind(this));
	this._tuner.on('stations:add', this._onStationsAdd.bind(this));
	this._tuner.on('stations:remove', this._onStationsRemove.bind(this));

}


TunerFaceplate.prototype = {

	_appendStationUI: function (station) {
		var stationsEl = document.getElementById('stations');
		var stationEl = document.createElement('div');
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
		stationsEl.appendChild(stationEl);

	},

	_onStationsRemove: function (station) {
		var stationsEl = document.getElementById('stations');
		var stationDeleteEl = stationsEl.querySelector('[data-station_id="' + station.id + '"]');
		stationDeleteEl.parentNode.parentNode.removeChild(stationDeleteEl.parentNode);
	},

	_onStationsAdd: function (station) {
		this._appendStationUI(station);
	},

	_onStationsChange: function (stations) {
		document.getElementById('stations').innerHTML = '';
		stations.each(this._appendStationUI, this);
	}

};

module.exports = TunerFaceplate;