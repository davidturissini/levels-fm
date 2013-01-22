var Levels = Levels || {};
Levels.Player = Levels.Player || {};

Levels.Player.Progress = Backbone.View.extend({

	tagName: 'div',
	className: 'player-progress',

	_drawElements: function () {

		this._progress = document.createElement('div');
		this._progress.className = 'player-progress-bar';

		this._waveform = document.createElement('img');
		this._waveform.className = 'player-waveform';

	},

	setTrack: function (track) {
		this.model = track;

		this._waveform.setAttribute('src', track.get('waveform_url'));
	},

	render: function () {
		this._drawElements();

		[this._progress, this._waveform].forEach(function (ui) {
			this.el.appendChild(ui);
		}.bind(this));

		jQuery(this.options.player.audioEl()).on('timeupdate', function () {
			var duration = this.model.get('duration') / 1000;
			this._progress.style.width = ((this.options.player.audioEl().currentTime / duration) * 100) + '%';
		}.bind(this));

		jQuery(this.el).on('click', function (e) {
			var percent = e.offsetX / e.currentTarget.offsetWidth;

			this.options.player.audioEl().currentTime = percent * this.options.player.audioEl().duration;

		}.bind(this));

		return this;

	}

})