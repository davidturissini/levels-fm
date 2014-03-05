var backbone = require('backbone');
var Station = require('./../model/Station');

var Stations = backbone.Collection.extend({
	model:Station
});


module.exports = Stations;