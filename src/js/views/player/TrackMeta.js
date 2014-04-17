var transparency = require('transparency');
var soundcloud = require('soundcloud').soundcloud;

function TrackMeta(element, player) {
	this._element = element;
	this._player = player;

	this._player.addEventListener('trackchange', this._onTrackChange.bind(this));
};

TrackMeta.prototype = {

	_onTrackChange: function (evt) {
		var element = this._element;

		soundcloud.api('/users/' + evt.track.get('user_id'), {
			client_id:'99308a0184193d62e064cb770f4c1eae'
		})

		.then(function (artist) {

			transparency.render(element, {
				title:evt.track.get('title'),
				username:artist.username,
				avatar:artist.avatar_url,
				artist_permalink:artist.permalink_url,
				permalink_url:evt.track.get('permalink_url')
			}, {
				artistlink:{
					href: function() {
						return this.artist_permalink;
					}
				},
				tracklink:{
					href:function () {
						return this.permalink_url;
					}
				},
				avatar:{
					src:function () {
						return this.avatar;
					}
				}
			});
		});
		
	}

};

module.exports = TrackMeta;