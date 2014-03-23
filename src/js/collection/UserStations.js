var backbone = require('backbone');
var Station = require('./../model/Station');
var levelsfm = require('./../services/levelsfm');

var UserStations = backbone.Collection.extend({
	model:Station,

	initialize: function (user) {
		this._user = user;
	},

	url: function () {
		return levelsfm.domain + '/users/' + this._user.get('username') + '/stations';
	}
});


module.exports = UserStations;