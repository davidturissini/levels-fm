var stateless = require('stateless');
var pigeon = require('pigeon');
var Q = require('q');
var Player = require('./ui/Player');
var PlayPauseButton = require('./ui/PlayPauseButton');
var Progress = require('./ui/Progress');
var Time = require('./ui/TrackTime');
var SkipButton = require('./ui/SkipButton');
var TrackMeta = require('./ui/TrackMeta');
var Station = require('./model/Station');
var User = require('./model/User');
var VoteUpButton = require('./ui/VoteUpButton');


var jquery = require('jquery');

var soundcloudClientId = '99308a0184193d62e064cb770f4c1eae';

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
			var currentStation;
			var user = new User({
				username:'dave'
			});


			var player = new Player(document.querySelector('.audio'), soundcloudClientId);
			var playPauseButton = new PlayPauseButton(document.getElementById('playPause'), player);
			var progress = new Progress(document.getElementById('progress'), player);
			var time = new Time(document.getElementById('time'), player);
			var trackMeta = new TrackMeta(document.getElementById('trackmeta'), player);
			var skipButton = new SkipButton(document.getElementById('skip'), player);
			var voteUpButton = new VoteUpButton(document.getElementById('voteup'), player);

			var stationCreateButton = document.getElementById('stationcreate');


			stationCreateButton.addEventListener('click', function () {
				var permalink = document.getElementById('stationcreateartist').value;
				pigeon.post('http://localhost:3000/users/dave/stations/' + permalink)
					.then(function (e) {
						console.log(e);
					});

			});


			function playNext(player, station) {
				return station.tracks().next()
					.then(function (track) {
						player.once('canplay', player.play.bind(player));
						player.track = track;
					})
			}


			
			user.stations().fetch().then(function (stations) {
				var stationsEl = document.getElementById('stations');
				stations.forEach(function (station) {
					var el = document.createElement('h1');
					el.innerHTML = station._attributes.title;
					stationsEl.appendChild(el);

					el.addEventListener('click', function () {
						skipButton.station = station;
						voteUpButton.station = station;
						playNext(player, station);
						currentStation = station;
					});

				});


				currentStation = stations[0];
				skipButton.station = currentStation;
				voteUpButton.station = currentStation;


				player.on('ended', function () {
					playNext(player, currentStation);
				});

				return playNext(player, currentStation);
			});

		}
	}])
	.activate();