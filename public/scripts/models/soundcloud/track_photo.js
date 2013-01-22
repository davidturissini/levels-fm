var Soundcloud = Soundcloud || {};
Soundcloud.Track = Soundcloud.Track || {};

Soundcloud.Track.Photo = Backbone.Model.extend({

	original: function () {
		return this.get('url').replace('large', 'original');
	}

})