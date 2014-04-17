function VoteUpButton (element, tuner) {
	this._element = element;
	this._tuner = tuner;

	this._element.addEventListener('click', this._onClick.bind(this));
}

VoteUpButton.prototype = {

	_onClick:function (evt) {
		this._tuner.pausePlayer();
		this._tuner.station.voteDown(this._tuner.currentTrack);
		this._tuner.playNext();
	}

};


module.exports = VoteUpButton;