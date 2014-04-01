var StationForm = require('./../../views/station/CreateForm');
var Tuner = require('./../../model/Tuner');
var TunerFaceplate = require('./../../ui/TunerFaceplate');
var Player = require('./../../ui/Player');
var backbone = require('backbone');
var jquery = require('jquery');
var templates = require('./../../services/templates');
var User = require('./../../model/User');

var Radio = backbone.View.extend({

	initialize: function (user) {
		this._user = user;
	},

	render: function () {
		var view = this;
		return templates.get('user/radio')
			.then(function (html) {
				view.el.innerHTML = html;
				var player = new Player(view.el.querySelector('.audio'));
				var tuner = new Tuner(player);
				var faceplate = new TunerFaceplate(view.el, tuner);

				var stationForm = new StationForm();
				stationForm.user = User.current();
				stationForm.$el.appendTo('.site-header');
				stationForm.render();
				

				stationForm.on('station_create', function (evt) {
					tuner.stations.add(evt.station);
				});

				
				jquery(document).on('click', '.station-title', function (evt) {
					var station = view._user.stations.get(evt.currentTarget.getAttribute('data-station_id'));
					tuner.station = station;
				});


				jquery(document).on('click', '.station-delete', function (evt) {
					var station = view._user.stations.get(evt.currentTarget.getAttribute('data-station_id'));
					station.destroy();
				});
				
				return view._user.stations.fetch().then(function (stations) {
					var station;

					tuner.stations = view._user.stations;

					station = view._user.stations.at(0);

					if (station) {
						tuner.station = station;
					}
				})

				.fail(function (err) {
					console.error(err.stack);
				});
			})

			.fail(function (err) {
				console.error(err.stack);
			});
	}

});

module.exports = Radio;