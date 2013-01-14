var User = require('./app/models/user').User, Station = require('./app/models/station').Station, Levels = require('./lib/levels').levels, sc = require('./lib/soundcloud').sc, express = require('express'), q = require('q');


function launchServer() {
	'use_strict';

	var app = express();

	app.configure(function () {
	  	app.use(express.static(__dirname + '/public'));
	});

	app.get('/config', function (req, res) {
		var config = {
			soundcloud: {
				client_id: Levels.config.soundcloud.client_id
			}
		};

		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.write(JSON.stringify(config));
		res.end();

	});

	app.get('/users/1/stations/1/song', function(req, res) {
		var user, station, track;

		user = User.find(1);
		station = user.find_station(1);
		station.pickTrack()
			.then(function (track) {
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.write(JSON.stringify(track));
				res.end();
			});
	});

	var port = process.env.PORT || 3000;

	app.listen(port);
	console.log('Listening on port 3000');

};

Levels.init().then(launchServer);
