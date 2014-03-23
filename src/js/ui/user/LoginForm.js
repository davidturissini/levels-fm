var User = require('./../../model/User');
var EventEmitter = require('events').EventEmitter;

function LoginForm (formTag) {
	this._formTag = formTag;
	this._usernameInput = formTag.querySelector('input[name="username"]');
	this._passwordInput = formTag.querySelector('input[name="password"]');

	this._formTag.addEventListener('submit', this._onSubmit.bind(this));

}

var proto = LoginForm.prototype = new EventEmitter();

proto.username = function () {
	return this._usernameInput.value;
}

proto.password = function () {
	return this._passwordInput.value;
}

proto._onSubmit = function (evt) {
	var form = this;

	evt.preventDefault();
	User.login(this.username(), this.password())
		.then(function (user) {
			form.emit('login', {
				user:user
			})
		});
}

module.exports = LoginForm;