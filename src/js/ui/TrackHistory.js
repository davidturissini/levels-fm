var jquery = require('jquery');
var TrackMeta = require('./TrackMeta');

function StationHistory (element, user) {
	this._element = element;

	this._user = user;

	this._user.history.on('add', this._appendTrack.bind(this));
	this._user.history.first(10).forEach(this._appendTrack.bind(this));

}

/*
	<section id="trackmeta" class="trackmeta">
		<img src="http://foswiki.org/pub/System/OriginalDocumentGraphics/blank.gif" width="100" height="100" class="avatar" />
		<h2><a href="#" class="title tracklink" target="_BLANK"></a></h2>
		<h1>by <a href="#" class="username artistlink" target="_BLANK"></a></h1>
	</section>
*/

StationHistory.prototype = {

	_appendTrack: function (track) {
		var trackMetaEl = document.createElement('li');
		trackMetaEl.classList.add('track');
		trackMetaEl.classList.add('trackmeta');

		var header = document.createElement('header');
		header.classList.add('trackmeta-header');
		trackMetaEl.appendChild(header);

		var avatar = document.createElement('img');
		avatar.classList.add('avatar');
		avatar.height = 100;
		avatar.width = 100;
		header.appendChild(avatar);


		var title = document.createElement('h1');
		var titleAnchor = document.createElement('a');
		titleAnchor.classList.add('username');
		titleAnchor.classList.add('artistlink');
		titleAnchor.setAttribute('target', '_BLANK');
		title.appendChild(titleAnchor);

		header.appendChild(title);

		

		var trackTitle = document.createElement('h2');
		var trackAnchor = document.createElement('a');
		trackAnchor.classList.add('title');
		trackAnchor.classList.add('tracklink');
		trackAnchor.setAttribute('target', '_BLANK');
		trackTitle.appendChild(trackAnchor);

		header.appendChild(trackTitle);

		jquery(trackMetaEl).prependTo(this._element);

		new TrackMeta(trackMetaEl, track);

	}

};

module.exports = StationHistory;