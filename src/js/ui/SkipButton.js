function SkipButton (element, player) {
	this._element = element;
	this._player = player;

	this._element.addEventListener('click', this._onClick.bind(this));
}

SkipButton.prototype = {

	_onClick: function (evt) {
		this._station.tracks().next()
			.then(function (track) {
				

				this._player.once('canplay', this._player.play.bind(this._player));
				this._player.track = track;

			}.bind(this))
	}

};

Object.defineProperties(SkipButton.prototype, {
	'station':{
		set: function (station) {
			this._station = station;
		},

		get: function () {
			return this._station;
		}
	}
})


module.exports = SkipButton;