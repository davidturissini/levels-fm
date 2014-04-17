var transparency = require('transparency');

function Time (element, player) {
	this._element = element;
	this._player = player;


	this._player.addEventListener('timeupdate', this._onTimeUpdate.bind(this));
	
};

Time.prototype = {

	_humanReadableTime: function (time) {
		var minutes = Math.floor(time/60);
		var seconds = Math.round(time - (minutes * 60));


		if (minutes < 10) {
			minutes = '0' + minutes;
		}

		if (seconds < 10) {
			seconds = '0' + seconds;
		}

		return minutes + ':' + seconds;
	},

	_onTimeUpdate: function (evt) {
		var currentTime = this._humanReadableTime(this._player.currentTime);
		var duration;

		if (typeof currentTime === 'number') {
			currentTime = '00:00';
		}

		var minutes;
		var seconds;

		minutes = Math.floor(this._player.track.get('duration') / 1000 / 60);
		seconds = Math.round(this._player.track.get('duration') / 1000 - (minutes * 60));
		if (seconds < 10) {
			seconds = '0' + seconds;
		}

		duration = minutes + ':' + seconds;

		document.getElementById('now-playing-duration').innerHTML = duration;
		document.getElementById('now-playing-currenttime').innerHTML = currentTime;

	}

};

module.exports = Time;