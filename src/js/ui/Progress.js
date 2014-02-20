var transparency = require('transparency');
var jquery = require('jquery');

function Progress (element, player) {
	this._element = element;
	this._player = player;
	this._overlay = this._element.querySelector('.overlay');

	this._player.addEventListener('timeupdate', this._onTimeUpdate.bind(this));

	this._element.addEventListener('click', this._onClick.bind(this), true);

	if (this._player.track) {
		this._drawUI(this._player.track);
	}

	this._player.on('trackchange', this._onTrackChange.bind(this));

}

Progress.prototype = {

	_drawUI: function (track) {

		transparency.render(this._element, track.attributes, {
			'waveform':{
				'src':function () {
					return this.waveform_url;
				}
			}
		});
	},

	_onTrackChange: function (evt) {
		this._drawUI(evt.track);
	},

	_onClick: function (evt) {
		var percentage = evt.layerX / this._element.offsetWidth;

		this._player.currentTime = this._player.duration * percentage;
	},


	_onTimeUpdate: function (evt) {
		var percentage = this._player.currentTime / this._player.duration;

		this._overlay.style.webkitTransform = 'scaleX(' + percentage + ')';
		
	}

};


module.exports = Progress;