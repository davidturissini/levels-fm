var Levels = Levels || {};

Levels.Player.Control.Volume = Levels.Player.Control.extend({

	tagName: 'input',
	className: 'player-volume',

	render: function () {
		this.el.setAttribute('type', 'range');
		this.el.setAttribute('min', 0);
		this.el.setAttribute('max', 1);
		this.el.setAttribute('step', .05);

		jQuery(this.el).on('change', function (e) {
			var value = e.currentTarget.value;
			this.options.player.setVolume(value);

		}.bind(this));

		this.el.setAttribute('value', 1);

		return this;
	}

})