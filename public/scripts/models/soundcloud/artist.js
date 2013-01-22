var Soundcloud = Soundcloud || {};

Soundcloud.Artist = Backbone.Model.extend({

	photo:function () {
		if (!this._photo) {
			this._photo = new Soundcloud.Artist.Photo({url:this.get('avatar_url')});
		}

		return this._photo;

	}

})