var Levels = Levels || {};

Levels.Player.Control.PlayPause = Levels.Player.Control.extend({

	tagName: 'a',
	className: 'play-pause',

	render: function () {
		this.el.innerHTML = 'play pause';

		jQuery(this.el).on('click', function () {
			this.options.player.playPause();
		}.bind(this));

		return this;
	}

})