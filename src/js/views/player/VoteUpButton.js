function VoteUpButton (element, tuner) {
	this._element = element;
	this._tuner = tuner;

	this._element.addEventListener('click', this._onClick.bind(this));
}

VoteUpButton.prototype = {

	_onClick:function (evt) {
		this._tuner.station.voteUp(this._tuner.currentTrack);
	}

};

module.exports = VoteUpButton;