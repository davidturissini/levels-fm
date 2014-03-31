var backbone = require('backbone');
var Artist = require('./../model/Artist');

var Artists = backbone.Collection.extend({
	model:Artist
});

module.exports = Artists;