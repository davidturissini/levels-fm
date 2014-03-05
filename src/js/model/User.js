var levelsfm = require('./../services/levelsfm');
var Stations = require('./../collection/Stations');
var backbone = require('backbone');

var User = backbone.Model.extend({

	initialize: function () {
		this._stations = new Stations();
		this._stations.url = levelsfm.domain + '/users/' + this.get('username') + '/stations';
	}

});


Object.defineProperties(User.prototype, {

	'stations': {

		get: function () {
			return this._stations;
		}

	}

});


module.exports = User;