var stateless = require('stateless');
var pigeon = require('pigeon');
var Q = require('q');
var Player = require('./ui/Player');
var PlayPauseButton = require('./ui/PlayPauseButton');
var Progress = require('./ui/Progress');
var Time = require('./ui/TrackTime');
var TrackMeta = require('./ui/TrackMeta');
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
			var player = new Player(document.querySelector('.audio'), soundcloudClientId);
			var playPauseButton = new PlayPauseButton(document.getElementById('playPause'), player);
			var progress = new Progress(document.getElementById('progress'), player);
			var time = new Time(document.getElementById('time'), player);
			var trackMeta = new TrackMeta(document.getElementById('trackmeta'), player);

			pigeon.get('http://localhost:3000/users/dave/stations/530136c593dfb00000000001/tracks/next')
				.then(function (e) {
					player.once('canplay', player.play.bind(player));
					player.track = JSON.parse(e);
				});
		}
	}])
	.activate();