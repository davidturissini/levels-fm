var Levels = Levels || {};
Levels.Player = Levels.Player || {};

Levels.Player.Control = Backbone.View.extend({

	track: function () {
		return this.model;
	},

	setTrack: function (track) {
		this.model = track;
	}

})