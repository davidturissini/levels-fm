var Track = require('./Track');
var levelsfm = require('./../services/levelsfm');
var backbone = require('backbone');

var Station = backbone.Model.extend({
	idAttribute:'_id',

	destroy: function () {
		return levelsfm.del('/stations/' + this.id);
	},

	tracks: function () {
		var stationId = this.id;

		return {

			next: function () {
				return levelsfm.get('/stations/' + stationId + '/tracks/next')
					.then(function (e) {
						return new Track(e);
					});
			}

		}

	},

	voteUp: function (track) {
		return levelsfm.get('/stations/' + this.id + '/tracks/up/' + track.id);
	},


	voteDown: function (track) {
		return levelsfm.del('/stations/' + this.id + '/tracks/' + track.id);
	}

});


module.exports = Station;