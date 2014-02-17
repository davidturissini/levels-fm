var soundcloud = require('soundcloud').soundcloud;
var transparency = require('transparency');
var jquery = require('jquery');
var events = require('events');

function Player(element, clientId) {
	this._track = null;
	this._element = element;
	this._clientId = clientId;

	this._element.addEventListener('play', this.emit.bind(this, 'play'));
	this._element.addEventListener('pause', this.emit.bind(this, 'pause'));
	this._element.addEventListener('timeupdate', this.emit.bind(this, 'timeupdate'));
	this._element.addEventListener('canplaythrough', this.emit.bind(this, 'canplaythrough'));
	this._element.addEventListener('canplay', this.emit.bind(this, 'canplay'));

};

Player.prototype = new events.EventEmitter();


Player.prototype.addEventListener = function () {
	return this.on.apply(this, arguments);
};


Player.prototype.removeEventListener = function () {
	return this.off.apply(this, arguments);
};


Player.prototype.play = function () {
	this._element.play();
};


Player.prototype.pause = function () {
	this._element.pause();
};

Object.defineProperties(Player.prototype, {
	'track':{
		set:function (track) {
			var oldTrack = this._track;
			this._track = track;

			this._element.src = this._track.stream_url + '?client_id=' + this._clientId;
			this.emit('trackchange', {
				previous:oldTrack,
				track:track
			});

		},
		get:function () {
			return this._track;
		}
	},
	'currentTime':{
		get:function () {
			return this._element.currentTime;
		},
		set:function (time) {
			this._element.currentTime = time;
		}
	},
	'duration':{
		get:function () {
			return this._element.duration;
		}
	},
	'paused':{
		get:function () {
			return this._element.paused;
		}
	}
});

module.exports = Player;