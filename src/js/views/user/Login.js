var backbone = require('backbone');
var templates = require('./../../services/templates');
var LoginForm = require('./../../ui/user/LoginForm');
var RegisterForm = require('./../../ui/user/RegisterForm');
var jquery = require('jquery');

var Login = backbone.View.extend({

	_clearLoginFormState: function () {
		this.loginForm.clearErrors();
		this.el.querySelector('.user-login-form').classList.remove('error');
	},

	render: function () {
		var view = this;

		jquery(document).on('click', '.user-register-link', function (evt) {
			evt.preventDefault();
			this._clearLoginFormState();
			view.$el.children().addClass('register');

		}.bind(this));

		jquery(document).on('click', '.user-login-link', function (evt) {
			evt.preventDefault();
			view.$el.children().removeClass('register');

		}.bind(this));

		return templates.get('user/login')
			.then(function (htmlString) {
				view.el.innerHTML = htmlString;

				view.loginForm = new LoginForm(view.el.querySelector('#user-login'));
				view.registerForm = new RegisterForm(view.el.querySelector('#user-register'));
				
				view.loginForm.on('login_attempt', this._clearLoginFormState.bind(this));

				view.loginForm.on('login_error', function (e) {
					view.el.querySelector('.user-login-form').classList.add('error');
				})

			})

			.fail(function (err) {
				console.error(err.stack);
			});
	}

});


module.exports = Login;
