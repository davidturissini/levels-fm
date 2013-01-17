var Levels = Levels || {};

Levels.Player.Timer = Backbone.View.extend({

	tagName: 'div',

	_totalTime: null,
	_currentTime: null,

	initialize: function () {
		this._createAndAppendElements();
	},

	setTrack: function (track) {
		var player = this.options.player;
		this.model = track;

		this._totalTime.innerHTML = this._millisecondsToTime(this.model.get('duration'));
		this._currentTime.innerHTML = this._millisecondsToTime(0);

		jQuery(player.audioEl()).on('timeupdate', function (e) {
			this._currentTime.innerHTML = this._millisecondsToTime(player.audioEl().currentTime * 1000);

		}.bind(this));
	},

	_createAndAppendElements: function () {
		this._totalTime = document.createElement('span');

		this._currentTime = document.createElement('span');

		
		this.el.appendChild(this._currentTime);
		this.el.appendChild(this._totalTime);

	},

	_millisecondsToTime: function (milliseconds) {
		var secondsLength = milliseconds / 1000,
		minutes = Math.floor(secondsLength / 60),
		seconds = Math.floor(secondsLength % 60);

		if (seconds < 10) {
			seconds = '0' + seconds;
		}

		if (minutes < 10) {
			minutes = '0' + minutes;
		}

		return minutes + ':' + seconds;
	}

})