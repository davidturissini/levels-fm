var EventEmitter = require('events').EventEmitter;
var backbone = require('backbone');
var q = require('q');

var Tuner = function (player) {
	this._player = player;
	this._stations = null;
	this._station = null;
	this._trackQueue = [];

	this._player.on('ended', this.playNext.bind(this));
};


Tuner.prototype = new EventEmitter();

Tuner.prototype.pausePlayer = function () {
	this._player.pause();
}

Tuner.prototype.__clearQueue = function () {
	this._trackQueue = [];
}

Tuner.prototype.__queueNext = function () {
	var currentStation = this.station;
	return this.station.tracks().next()
		.then(function (track) {
			if (this.station === currentStation) {
				this._trackQueue.push(track);
				this._player.preFetch(track);
			}
		}.bind(this));
}

Tuner.prototype.getNext = function () {
	var defer;
	var promise;

	if (this._trackQueue.length > 0) {
		defer = q.defer();
		defer.resolve(this._trackQueue.shift());

		promise = defer.promise;
	} else {
		promise = this.station.tracks().next();
	}

	return promise;
}


Tuner.prototype.playNext = function () {
	var player = this._player;
	this.getNext().then(function (track) {
		player.track = track;

		if (this.station.get('status') === 'imported') {
			this.__queueNext();
		} else if (this.station.get('status') === 'importing') {
			this.station.fetch();
		}
	}.bind(this));

	
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
			this.__clearQueue();
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

			this.__clearQueue();
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