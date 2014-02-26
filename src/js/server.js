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
var VoteDownButton = require('./ui/VoteDownButton');
var levelsfm = require('./services/levelsfm');


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
			var voteDownButton = new VoteDownButton(document.getElementById('votedown'), player);

			var stationCreateButton = document.getElementById('stationcreate');


			stationCreateButton.addEventListener('click', function () {
				var permalink = document.getElementById('stationcreateartist').value;
				Station.create(user, permalink)
					.then(function (station) {
						appendStationUI(station);
						loadStation(station);
					});
			});


			function playNext(player, station) {
				return station.tracks().next()
					.then(function (track) {
						player.once('canplay', player.play.bind(player));
						player.track = track;
					})
			}


			function loadStation (station) {
				currentStation = station;
				skipButton.station = station;
				voteUpButton.station = station;
				voteDownButton.station = station;
				return playNext(player, station);
			}

			var stationsEl = document.getElementById('stations');
			function appendStationUI (station) {
				var title = document.createElement('h1');
				title.innerHTML = station.get('title');
				stationsEl.appendChild(title);

				title.addEventListener('click', function () {
					loadStation(station);
				});

				var del = document.createElement('span');
				del.innerHTML = 'delete';
				stationsEl.appendChild(del);

				del.addEventListener('click', function () {
					station.destroy()
						.then(function () {
							stationsEl.removeChild(title);
							stationsEl.removeChild(del);
						});
				});
			}


			
			user.stations().fetch().then(function (stations) {
				
				stations.forEach(appendStationUI);


				
				


				player.on('ended', function () {
					playNext(player, currentStation);
				});

				return loadStation(stations[0]);

			});

		}
	}])
	.activate();