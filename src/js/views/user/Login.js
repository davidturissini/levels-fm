var backbone = require('backbone');
var templates = require('./../../services/templates');
var LoginForm = require('./../../ui/user/LoginForm');

var Login = backbone.View.extend({

	render: function () {
		var view = this;

		return templates.get('user/login')
			.then(function (htmlString) {
				view.el.innerHTML = htmlString;

				view.loginForm = new LoginForm(view.el.querySelector('#user-login'));

				view.loginForm.on('login', function (evt) {
					view.trigger('user:login', evt);
				});
			})

			.fail(function (err) {
				console.error(err.stack);
			});
	}

});


module.exports = Login;
