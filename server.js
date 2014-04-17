var express = require('express');
var serverPort = process.env.PORT || 3000;
var fs = require('fs');
var cons = require('consolidate');

var StationShowController = require('./src/js/controller/station/Show');

var app = express();
app.engine('dust', cons.dust);


app.configure(function(){
    app.set('view engine', 'dust');
    app.set('views', __dirname + '/src/html');
    app.use(express.static(__dirname + '/public', {redirect: false}));
    app.use(express.bodyParser());
    app.use(app.router);
});


app.get('/users/:username/stations/:station_id', function (req, res) {
	res.render('station/show.html.dust', {});
});


app.listen(serverPort);
console.log('Listening on port ' + serverPort);


/*
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




/*
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
			defer.resolve({
				foo:'bar'
			});
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
		path:'/users/:username/stations/:station_id',

		template:staticDir + '/html/station/show.html',

		action:function (document, routeData, templateString) {
			var defer = q.defer();
			this._controller = StationShowController.create(routeData);

			var compiled = dustjs.compile(templateString, 'stationShow');
			dustjs.loadSource(compiled);
			dustjs.render('stationShow', this._controller.getTemplateData(), function (err, out) {
			  console.log(out);
			  defer.resolve(out);
			});
			
			return defer.promise

				.fail(function (e) {
					console.log(e.stack);
				});
		},

		onLoad: function () {
			
		}

	}])
	.activate();
*/
