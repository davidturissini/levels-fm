var Soundcloud = Soundcloud || {};
Soundcloud.Track = Soundcloud.Track || {};

Soundcloud.Artist.Photo = Backbone.Model.extend({

	large: function () {
		return this.get('url').replace('large', 'original');
	}

})