var jquery = require('jquery');

function PlayPauseButton (element, player) {
	this._element = element;
	this._player = player;

	this._player.addEventListener('play', this._onPlay.bind(this));
	this._player.addEventListener('pause', this._onPause.bind(this));


	this._element.addEventListener('click', this._onClick.bind(this));

};

PlayPauseButton.prototype = {

	_onClick: function (evt) {
		if (this._player.paused === true) {
			this._player.play();
		} else {
			this._player.pause();
		}
	},

	_toggleClassName: function () {
		if (this._player.paused === true) {
			jquery(this._element).removeClass('playing');
		} else {
			jquery(this._element).addClass('playing');
		}
	},

	_onPlay: function (evt) {
		this._toggleClassName();
	},

	_onPause: function (evt) {
		this._toggleClassName();
	}

};


module.exports = PlayPauseButton;