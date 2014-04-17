var User = require('./../../model/User');
var EventEmitter = require('events').EventEmitter;
var jquery = require('jquery');

function LoginForm (formTag) {
	this._formTag = formTag;
	this._usernameInput = formTag.querySelector('input[name="username"]');
	this._passwordInput = formTag.querySelector('input[name="password"]');
	this._errorsEl = document.createElement('ul');
	this._errorsEl.classList.add('errors');
	
	this._formTag.addEventListener('submit', this._onSubmit.bind(this));

}

var proto = LoginForm.prototype = new EventEmitter();

proto.username = function () {
	return this._usernameInput.value;
}

proto.password = function () {
	return this._passwordInput.value;
}

proto.addError = function (error) {
	var li = document.createElement('li');
	li.classList.add('error');
	li.innerHTML = error.message;
	this._errorsEl.appendChild(li);

	if (this._errorsEl.parentNode === null) {
		jquery(this._errorsEl).insertBefore(this._formTag);
	}
}

proto.clearErrors = function () {
	if (this._errorsEl.parentNode) {
		this._errorsEl.parentNode.removeChild(this._errorsEl);
	}

	this._errorsEl.innerHTML = '';
}

proto._onSubmit = function (evt) {
	var form = this;
	evt.preventDefault();

	form.emit('login_attempt', {
		target:this,
		username:this.username(),
		originalEvent:evt
	});
	
	
	User.login(this.username(), this.password())
		.fail(function (e) {
			form.addError(e);
			form.emit('login_error', e);
		})

		.fail(function (e) {
			console.log(e.stack);
		});
}

module.exports = LoginForm;