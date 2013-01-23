var Levels = Levels || {};

Levels.Player.Control.Stop = Levels.Player.Control.extend({

	tagName: 'a',
	className: 'stop',

	render: function () {

		this.el.innerHTML = 'stop';

		jQuery(this.el).on('click', function () {
			this.options.player.pause();
		}.bind(this));

		return this;
	}

})