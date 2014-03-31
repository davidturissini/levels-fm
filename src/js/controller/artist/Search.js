var ArtistsCollection = require('./../../collection/Artists');
var ArtistsListView = require('./../../views/artist/List');

function ArtistSearch (artistSearchInput, options) {
	options = options || {};
	this._collection = options.collection || new ArtistsCollection();
	this._inputView = artistSearchInput;
	this._artistListView = new ArtistsListView({
		model:this._collection
	});

	this._inputView.on('results', this._collection.reset.bind(this._collection));

};

ArtistSearch.prototype = {

};


module.exports = ArtistSearch;