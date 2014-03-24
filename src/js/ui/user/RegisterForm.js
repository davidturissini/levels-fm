var User = require('./../../model/User');
var EventEmitter = require('events').EventEmitter;

function RegisterForm (formTag) {
	this._formTag = formTag;
	this._usernameInput = formTag.querySelector('input[name="username"]');
	this._passwordInput = formTag.querySelector('input[name="password"]');
	this._confirmPasswordInput = formTag.querySelector('input[name="confirm"]');

	this._formTag.addEventListener('submit', this._onSubmit.bind(this));

}

var proto = RegisterForm.prototype = new EventEmitter();

proto.username = function () {
	return this._usernameInput.value;
}

proto.password = function () {
	return this._passwordInput.value;
}

proto.confirmPassword = function () {
	return this._confirmPasswordInput.value;
}

proto._onSubmit = function (evt) {
	var form = this;

	evt.preventDefault();
	User.register(this.username(), this.password(), this.confirmPassword())
		.fail(function () {
			console.log(arguments);
			console.log('failed');
		});
}

module.exports = RegisterForm;