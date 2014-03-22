var backbone = require('backbone');
var Track = require('./../model/Track');

var Tracks = backbone.Collection.extend({
	model:Track
});


module.exports = Tracks;