var Station = require('./../model/Station');
var EventEmitter = require('events').EventEmitter;

function StationForm (textField, submitButton) {
	this._textField = textField;
	this._submitButton = submitButton;
	this._user = null;

	submitButton.addEventListener('click', this.onButtonClick.bind(this));
}

StationForm.prototype = new EventEmitter();

StationForm.prototype.onButtonClick = function (evt) {
	evt.preventDefault();
	var permalink = this._textField.value;
	Station.create(this._user, permalink)
		.then(function (station) {
			this.emit('station_create', {
				station:station
			});
		}.bind(this));
}


Object.defineProperties(StationForm.prototype, {
	user:{
		get:function () {
			return this._user;
		},

		set:function (user) {
			this._user = user;
		}
	}
});


module.exports = StationForm;