var Levels = Levels || {};

Levels.Station = Backbone.Model.extend({

	nextTrack: function () {
		return jQuery.ajax({
			url: '/users/1/stations/' + this.get('id') + '/song',
			contentType: "json"
		}).then(function (trackJSON) {
			return new Soundcloud.Track(trackJSON);
		})
	}

});