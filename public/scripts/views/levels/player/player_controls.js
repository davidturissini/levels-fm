var Levels = Levels || {};

Levels.Player.Control.Controls = Backbone.View.extend({

	tagName: 'section',
	className: 'player-controls',

	_stop: null,
	_playPause: null,
	_next: null,

	_drawElements: function () {

		this._next = document.createElement('a');
		this._next.className = 'next';
		this._next.innerHTML = 'Next';

		jQuery(this._next).on('click', function () {
			this.options.player.trigger('track:next');
		}.bind(this));

	},

	render: function () {
		this._drawElements();

		[this._stop, this._next].forEach(function (ui) {
			this.el.appendChild(ui);
		}.bind(this))

		return this;

	}
})