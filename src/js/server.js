var stateless = require('stateless');
var Q = require('q');
var Station = require('./model/Station');
var User = require('./model/User');
var StationForm = require('./ui/StationForm');
var Tuner = require('./model/Tuner');
var TunerFaceplate = require('./ui/TunerFaceplate');
var Player = require('./ui/Player');
var jquery = require('jquery');
var backbone = require('backbone');
backbone.ajax = function () {
	return jquery.ajax.apply(jquery, arguments);
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
			var user = new User({
				username:'dave'
			});
			
			var player = new Player(document.querySelector('.audio'));
			var tuner = new Tuner(player);
			var faceplate = new TunerFaceplate(tuner);
			var stationForm = new StationForm(document.getElementById('stationcreateartist'), document.getElementById('stationcreate'));
			stationForm.user = user;


			stationForm.on('station_create', function (evt) {
				tuner.stations.add(evt.station);
			});

			jquery(document).on('click', '.station-title', function (evt) {
				var station = user.stations.get(evt.currentTarget.getAttribute('data-station_id'));
				tuner.station = station;
			});


			jquery(document).on('click', '.station-delete', function (evt) {
				var station = user.stations.get(evt.currentTarget.getAttribute('data-station_id'));
				station.destroy();
			});


			user.stations.fetch().then(function (stations) {
				var station;

				tuner.stations = user.stations;

				station = user.stations.at(0);

				if (station) {
					tuner.station = station;
				}
			});


		}
	}])
	.activate();