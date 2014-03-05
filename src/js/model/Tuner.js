var EventEmitter = require('events').EventEmitter;
var backbone = require('backbone');

var Tuner = function (player) {
	this._player = player;
	this._stations = null;
	this._station = null;
};


Tuner.prototype = new EventEmitter();

Tuner.prototype.pausePlayer = function () {
	this._player.pause();
}

Tuner.prototype.getNext = function () {
	return this.station.tracks().next();
}


Tuner.prototype.playNext = function () {
	var player = this._player;
	this.getNext().then(function (track) {
		player.track = track;
	});
}


Object.defineProperties(Tuner.prototype, {

	'player': {
		get: function () {
			return this._player;
		}
	},

	'currentTrack': {
		get: function () {
			return this._player.track;
		}
	},

	'station': {
		get:function () {
			return this._station;
		},
		set: function (station) {
			this._station = station;
			this.playNext();
		}
	},

	'stations': {
		get: function () {
			return this._stations;
		},

		set: function (stations) {
			if (this._stations && typeof this._stations.off === 'function') {
				this._stations.off();
			}

			this._stations = stations;


			this._stations.on('add', function (station) {

				this.station = station;

				this.emit('stations:add', station);
			}, this);


			this._stations.on('remove', this.emit.bind(this, 'stations:remove'));
			this._stations.on('reset', this.emit.bind(this, 'stations:reset'));

			this.emit('stations:changed', stations);



		}
	}

});


module.exports = Tuner;