var Player = Backbone.View.extend({

	tagName: 'audio',

	_track: null,

	track: function () {
		return this._track;
	},

	setTrack: function (track) {
		var streamUrl;

		this._track = track;

		streamUrl = this._track.get('stream_url') + '?' + jQuery.param(this.options.config.soundcloud);
		this.el.setAttribute('src', streamUrl);
	},

	pause: function () {
		this.el.pause();
	},

	play: function () {
		this.el.play();
	},

	trackPercent: function () {
		return (this.el.currentTime / this.el.duration) * 100;
	},

	render: function (elem) {
		var targetEl = elem || document.body;
		targetEl.appendChild(this.el);

		jQuery(this.el).on('ended', function (e) {
			alert('done');
		});

		return this;
	}

})