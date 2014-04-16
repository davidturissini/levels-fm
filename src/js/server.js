require('./utils/polyfills');
var stateless = require('stateless');
var Q = require('q');
var Station = require('./model/Station');
var User = require('./model/User');
var jquery = require('jquery');
var backbone = require('backbone');
var LoginView = require('./views/user/Login');
var RadioView = require('./views/user/Radio');
var UserNameLabel = require('./ui/user/UserNameLabel');


backbone.ajax = function () {
	return jquery.ajax.apply(jquery, arguments);
}
backbone.$ = jquery;


function showRadioView (user) {
	var body = jquery(document.getElementById('content'));
	var radioView = new RadioView(user);
	jquery(document.body).addClass('user-logged-in');

	radioView.render()
		.then(function () {
			body.empty();
			body.append(radioView.el);
		})

		.fail(function (err) {
			console.error(err.stack);
		});
}


function showLoginView () {
	var body = jquery(document.getElementById('content'));
	var view = new LoginView();
	body.empty();
	jquery(document.body).removeClass('user-logged-in');

	view.render()
		.then(function (e) {
			body.append(view.el);
		})

		.fail(function (err) {
			console.error(err.stack);
		});
}


var staticDir = process.browser ? '' : __dirname + '/../';
stateless
	.setPort(process.env.PORT || 5000)
	.setServerRoot(staticDir)
	.setLayoutsDirectory('/html/layouts')
	.setDefaultLayoutFile('main.html')
	.setRoutes([{
		path:'/',
		template:staticDir + '/html/home/index.html',

		action:function (document, routeData) {
			var defer = Q.defer();
			defer.resolve();
			return defer.promise;
		},

		onLoad: function () {
			var user = User.current();

			user.on('login_status_change', function (evt) {
				if (user.isLoggedIn()) {
					showRadioView(evt.user);
				} else {
					showLoginView();
				}
			});


			jquery(document.body).on('click', '.user-logout-link', function (e) {
				e.preventDefault();
				user.logout();
			});

			user.verifyLoggedIn()
				.then(function (verified) {
					var content;
					var body = jquery(document.getElementById('content'));
					body.empty();

					if (verified === false) {
						user.destroyCookie();
						return showLoginView();
					}

					var userNameLabel = new UserNameLabel(document.getElementById('user-name-label'), user);
					showRadioView(user);

				})

				.fail(function (e) {
					console.log(e.stack);
				});
		}

	},{
		path:'/users/:username',

		template:staticDir + '/html/home/index.html',

		action:function (document, routeData) {
			var defer = Q.defer();
			defer.resolve();
			return defer.promise;
		},

		onLoad: function () {
			console.log('yay!');
		}

	}])
	.activate();
