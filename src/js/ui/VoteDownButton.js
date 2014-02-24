function VoteUpButton (element, player) {
	this._element = element;
	this._player = player;

	this._element.addEventListener('click', this._onClick.bind(this));
}

VoteUpButton.prototype = {

	_onClick:function (evt) {
		console.log(this._player.track);
		this._station.voteDown(this._player.track);
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