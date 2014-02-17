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

	_onPlay: function (evt) {
		this._element.innerHTML = 'Pause';
	},

	_onPause: function (evt) {
		this._element.innerHTML = 'Play';
	}

};


module.exports = PlayPauseButton;