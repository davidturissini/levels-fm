var backbone = require('backbone');
var jquery = require('jquery');
backbone.$ = jquery;
var soundcloud = require('./services/soundcloud');

var router = new backbone.Router();


var StationShowController = require('./controller/station/Show');
var Player = require('./views/player/Player');
var Tuner = require('./model/Tuner');
var TunerFaceplate = require('./views/tuner/Faceplate');


router.route('', '', function () {
	
});

router.route('users/:user_id/stations/:station_id', '', function (user_id, station_id) {

	var controller = StationShowController.create({
		station_id:station_id
	});

	var player = new Player(document.getElementById('player').querySelector('.audio'));
	var tuner = new Tuner(player);
	var faceplate = new TunerFaceplate(document.getElementById('content'), tuner);

	tuner.station = controller.getStation();

});

backbone.history.start({
	pushState:true
});