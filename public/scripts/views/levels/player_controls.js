var Levels = Levels || {};

Levels.Player.Controls = Backbone.View.extend({

	tagName: 'section',
	className: 'controls',

	_stop: null,
	_playPause: null,

	_drawElements: function () {

		this._stop = document.createElement('a');
		this._stop.className = 'stop';
		this._stop.innerHTML = 'stop';

		jQuery(this._stop).on('click', function () {
			this.options.player.pause();
		}.bind(this));

		this._playPause = document.createElement('a');
		this._playPause.className = 'play-pause';
		this._playPause.innerHTML = 'play pause';

		jQuery(this._playPause).on('click', function () {
			this.options.player.playPause();
		}.bind(this));

	},

	render: function () {
		this._drawElements();

		[this._playPause, this._stop].forEach(function (ui) {
			this.el.appendChild(ui);
		}.bind(this))

		return this;

	}
})