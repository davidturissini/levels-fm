var Soundcloud = Soundcloud || {};

Soundcloud.Track = Backbone.Model.extend({

	initialize: function () {
		if (this.has('user')) {
			this.set('user', new Soundcloud.Artist(this.get('user')));
		}
	},

	photo: function () {
		if (!this._photo) {
			this._photo = new Soundcloud.Track.Photo({url:this.get('artwork_url')});
		}

		return this._photo;

	}

})