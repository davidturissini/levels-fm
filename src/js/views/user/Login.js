var backbone = require('backbone');
var templates = require('./../../services/templates');
var LoginForm = require('./../../ui/user/LoginForm');
var RegisterForm = require('./../../ui/user/RegisterForm');
var jquery = require('jquery');

var Login = backbone.View.extend({

	render: function () {
		var view = this;

		jquery(document).on('click', '.user-register-link', function (evt) {
			evt.preventDefault();
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

			})

			.fail(function (err) {
				console.error(err.stack);
			});
	}

});


module.exports = Login;
