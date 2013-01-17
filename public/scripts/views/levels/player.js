var Levels = Levels || {};

Levels.Player = Backbone.View.extend({

	tagName: 'section',

	_station: null,

	_audioTag: null,
	_trackTitle: null,
	_artistTitle: null,
	_progress: null,
	_controls: null,
	_timer: null,

	_createAndAppendElements: function () {
		this._timer = new Levels.Player.Timer({
			player: this
		}).render();

		this._trackTitle = document.createElement('h1');
		this._artistTitle = document.createElement('h2');
		this._progress = document.createElement('progress');
		this._audioTag = document.createElement('audio');

		this._trackLink = document.createElement('a');
		this._trackLink.setAttribute('target', '_blank');
		this._trackTitle.appendChild(this._trackLink);

		this._artistLink = document.createElement('a');
		this._artistLink.setAttribute('target', '_blank');
		this._artistTitle.appendChild(this._artistLink);

		this.el.appendChild(this._audioTag);
		this.el.appendChild(this._trackTitle);
		this.el.appendChild(this._artistTitle);
		this.el.appendChild(this._progress);
		this.el.appendChild(this._timer.el);


		jQuery(this._audioTag).on('timeupdate', function () {
			this._progress.value = this._audioTag.currentTime;
		}.bind(this));

		jQuery(this._progress).on('click', function (e) {
			var percent = e.offsetX / e.currentTarget.offsetWidth;

			this.audioEl().currentTime = percent * this.audioEl().duration;

		}.bind(this));
	},

	audioEl: function () {
		return this._audioTag;
	},

	station: function () {
		return this._station;
	},

	nextTrack: function () {
		var player = this;
		
		this._station.nextTrack()
			.then(function (track) {
				player.setTrack(track);
				player.play();
			})
	},

	setStation: function (station) {
		this._station = station;

		this.nextTrack();
	},

	track: function () {
		return this.model;
	},

	setTrack: function (track) {
		var streamUrl;

		this.model = track;

		streamUrl = this.model.get('stream_url') + '?' + jQuery.param(this.options.config.soundcloud);
		this._audioTag.setAttribute('src', streamUrl);
		this._trackLink.innerHTML = track.get('title');
		this._trackLink.setAttribute('href', track.get('permalink_url'));

		this._artistLink.innerHTML = track.get('user').username;
		this._artistLink.setAttribute('href', track.get('user').permalink_url);
		
		this._progress.max = track.get('duration') / 1000;
		this._progress.value = 0;

		this._timer.setTrack(track);
	},

	isPlaying: function () {
		return !this._audioTag.paused;
	},

	playPause: function () {
		if (this.isPlaying()) {
			this.pause();
		} else {
			this.play();
		}
	},

	pause: function () {
		this._audioTag.pause();
	},

	play: function () {
		this._audioTag.play();
	},

	trackPercent: function () {
		return (this._audioTag.currentTime / this._audioTag.duration) * 100;
	},

	render: function (elem) {
		var targetEl = elem || document.body;

		this._createAndAppendElements();
		this._controls = new Levels.Player.Controls({
			player: this
		}).render();

		this.el.appendChild(this._controls.el);
		targetEl.appendChild(this.el);

		return this;
	}

})