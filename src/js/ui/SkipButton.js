function SkipButton (element, tuner) {
	this._element = element;
	this._tuner = tuner;

	this._element.addEventListener('click', this._onClick.bind(this));
}

SkipButton.prototype = {

	_onClick: function (evt) {
		this._tuner.playNext();
	}

};


module.exports = SkipButton;