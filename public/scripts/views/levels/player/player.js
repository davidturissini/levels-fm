var Levels = Levels || {};

Levels.Player = Backbone.View.extend({

	tagName: 'section',
	className: 'player',

	_audioTag: null,
	_trackTitle: null,
	_artistTitle: null,
	_controls: null,
	_timer: null,

	_drawElements: function () {
		this._trackTitle = document.createElement('h1');
		this._artistTitle = document.createElement('h2');
		this._audioTag = document.createElement('audio');

		this._trackLink = document.createElement('a');
		this._trackLink.setAttribute('target', '_blank');
		this._trackTitle.appendChild(this._trackLink);

		this._artistLink = document.createElement('a');
		this._artistLink.setAttribute('target', '_blank');
		this._artistTitle.appendChild(this._artistLink);

		this._artistImage = document.createElement('img');
		this._artistImage.className = 'artist-image';

		this._playPause = new Levels.Player.Control.PlayPause({
			player:this
		}).render();

		this._timer = new Levels.Player.Control.Timer({
			player: this
		}).render();

		this._volumeControl = new Levels.Player.Control.Volume({
			player:this
		}).render();

		this._stop = new Levels.Player.Control.Stop({
			player:this
		}).render();

	},

	audioEl: function () {
		return this._audioTag;
	},

	station: function () {
		return this._station;
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

		this._artistLink.innerHTML = track.get('user').get('username');
		this._artistLink.setAttribute('href', track.get('user').get('permalink_url'));

		this._artistImage.setAttribute('src', track.get('user').photo().get('url'));
		
		this._progress.setTrack(track);
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

	setVolume: function (volume) {
		this.audioEl().volume = volume;
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
		this._drawElements();

		this._progress = new Levels.Player.Control.Progress({
			player: this
		}).render();

		this.el.appendChild(this._audioTag);
		
		this.el.appendChild(this._artistImage);
		this.el.appendChild(this._trackTitle);
		this.el.appendChild(this._artistTitle);

		this.el.appendChild(this._progress.el);
		this.el.appendChild(this._playPause.el);
		this.el.appendChild(this._stop.el);
		this.el.appendChild(this._volumeControl.el);

		this.el.appendChild(this._timer.el);

		targetEl.appendChild(this.el);

		return this;
	}

})