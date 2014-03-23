var stateless = require('stateless');
var Q = require('q');
var Station = require('./model/Station');
var User = require('./model/User');
var jquery = require('jquery');
var backbone = require('backbone');
var LoginView = require('./views/user/Login');
var RadioView = require('./views/user/Radio');

window.jquery = jquery;
backbone.ajax = function () {
	return jquery.ajax.apply(jquery, arguments);
}
backbone.$ = jquery;



function showRadioView (user) {
	var body = jquery(document.getElementById('content'));
	window.user = user;
	var radioView = new RadioView(user);

	radioView.render()
		.then(function () {
			body.empty();
			body.append(radioView.el);
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
			var view;
			var content;
			var body = jquery(document.getElementById('content'));
			body.empty();

			if (user.isAnonymous()) {
				view = new LoginView();
				

				view.render()
					.then(function (e) {
						body.append(view.el);
					})

					.fail(function (err) {
						console.error(err.stack);
					});

				view.on('user:login', function (evt) {
					showRadioView(evt.user);
				});

			} else {
				showRadioView(user);
			}


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

window.User = User;