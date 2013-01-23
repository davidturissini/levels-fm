var Levels = Levels || {};

Levels.Player.Control.Next = Levels.Player.Control.extend({

	tagName: 'a',
	className: 'next',

	render: function () {
		this.el.innerHTML = 'Next';

		jQuery(this.el).on('click', function () {
			this.options.player.trigger('track:next');
		}.bind(this));
	}

})