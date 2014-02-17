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
		var time = this;

		transparency.render(this._element, this._player, {

			'currenttime':{
				text: function () {
					return time._humanReadableTime(this.currentTime);
				}
			},

			'duration':{
				text: function () {
					var minutes;
					var seconds;

					minutes = Math.floor(this.duration / 60);
					seconds = Math.round(this.duration - (minutes * 60));
					if (seconds < 10) {
						seconds = '0' + seconds;
					}

					return minutes + ':' + seconds;

				}
			}

		});
	}

};

module.exports = Time;