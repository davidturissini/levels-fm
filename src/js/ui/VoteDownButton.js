function VoteUpButton (element, player) {
	this._element = element;
	this._player = player;

	this._element.addEventListener('click', this._onClick.bind(this));
}

VoteUpButton.prototype = {

	_onClick:function (evt) {
		this._player.pause();
		this._station.voteDown(this._player.track);
		this._station.tracks().next()
			.then(function (track) {
				this._player.track = track;
				this._player.play();
			}.bind(this));
	}

};


Object.defineProperties(VoteUpButton.prototype, {

	station:{
		get:function () {
			return this._station;
		},
		set:function (station) {
			this._station = station;
		}
	}

});


module.exports = VoteUpButton;