var Levels = Levels || {};

Levels.Player = Backbone.View.extend({

	tagName: 'section',

	_track: null,

	_audioTag: null,
	_trackTitle: null,
	_artistTitle: null,
	_progress: null,

	audioEl: function () {
		return this._audioTag;
	},

	track: function () {
		return this._track;
	},

	setTrack: function (track) {
		var streamUrl;

		this._track = track;

		streamUrl = this._track.get('stream_url') + '?' + jQuery.param(this.options.config.soundcloud);
		this._audioTag.setAttribute('src', streamUrl);
		this._trackTitle.innerHTML = track.get('title');
		this._artistTitle.innerHTML = track.get('user').username;
		this._progress.max = track.get('duration') / 1000;
		this._progress.value = 0;
	},

	pause: function () {
		this.el.pause();
	},

	play: function () {
		this._audioTag.play();
	},

	trackPercent: function () {
		return (this._audioTag.currentTime / this._audioTag.duration) * 100;
	},

	render: function (elem) {
		var targetEl = elem || document.body;

		this._trackTitle = document.createElement('h1');
		this._artistTitle = document.createElement('h2');
		this._progress = document.createElement('progress');
		this._audioTag = document.createElement('audio');

		jQuery(this._audioTag).on('timeupdate', function () {
			this._progress.value = this._audioTag.currentTime;
		}.bind(this));

		this.el.appendChild(this._audioTag);
		this.el.appendChild(this._trackTitle);
		this.el.appendChild(this._artistTitle);
		this.el.appendChild(this._progress);


		targetEl.appendChild(this.el);

		return this;
	}

})