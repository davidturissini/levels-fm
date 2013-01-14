var Station = require('./app/station').Station, Levels = require('./lib/levels').levels, sc = require('./lib/soundcloud').sc, express = require('express'), q = require('q');


function launchServer() {
	'use_strict';

	var app = express();
	sc.setConfig(Levels.config.soundcloud);

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

	app.get('/song', function(req, res){
		var station = Station.seed("dave-airborne", sc)
						.then(function (tracks) {
							res.writeHead(200, { 'Content-Type': 'application/json' });
							res.write(JSON.stringify(tracks[0]));
							res.end();
						});
	});

	var port = process.env.PORT || 3000;

	app.listen(port);
	console.log('Listening on port 3000');

};

Levels.init().then(launchServer);
