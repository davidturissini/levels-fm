var Station = require('./../../model/Station');
var EventEmitter = require('events').EventEmitter;
var ArtistsCollection = require('./../../collection/Artists');
var ArtistSearchInputView = require('./../artist/SearchInput');
var ArtistListView = require('./../artist/List');
var backbone = require('backbone');
var templates = require('./../../services/templates');
var mustache = require('mustache');
var jquery = require('jquery');


var StationCreateForm = backbone.View.extend({

	initialize: function () {
		jquery(document.body).on('keyup', function (e) {
			if (e.keyCode === 27) {
				this.hideAutocompleteResults();
			}
		}.bind(this));

		
	},

	tagName:'form',

	className:'station-form clearfix',

	events: {
		'focus .name-input' : 'inputFocus',
		'click .autocomplete-results .artist' : 'onArtistClick',
		'submit' : 'onSubmit'
	},

	_resetAutocompleteResults: function () {
		this._autoCompleteResults.reset();
	},

	_hideToClick: function (e) {
		if (!jquery(e.target).is('.station-form, .station-form *')) {
			this.hideAutocompleteResults();
		}
	},

	hideAutocompleteResults: function () {
		this._autoCompleteResultList.$el.addClass('hidden');
		jquery(document.body).off('click', this._boundHideToClick);
	},

	showAutocompleteResults: function () {
		this._autoCompleteResultList.$el.removeClass('hidden');

		if (!this._boundHideToClick) {
			this._boundHideToClick = this._hideToClick.bind(this);
		}

		jquery(document.body).on('click', this._boundHideToClick);
	},

	inputFocus: function () {
		this.showAutocompleteResults();
	},

	onArtistClick: function (evt) {
		var permalink = evt.currentTarget.getAttribute('data-permalink');

		this.hideAutocompleteResults();

		Station.create(this._user, permalink)
			.then(function (station) {
				this.trigger('station_create', {
					station:station
				});
			}.bind(this));
	},

	render: function () {
		templates.get('station/_form')
			.then(function (htmlString) {
				this.$el.html(mustache.render(htmlString, {}));
				this._autoCompleteResults = new ArtistsCollection();
				var autoCompleteResultsEl = this.el.querySelector('.autocomplete-results');

				this._input = new ArtistSearchInputView({
					model:this._autoCompleteResults
				});

				this._input.$el.insertAfter(autoCompleteResultsEl);
				
				this._autoCompleteResultList = new ArtistListView({
					model:this._autoCompleteResults
				});

				this._autoCompleteResultList.$el.appendTo(autoCompleteResultsEl);
				this._autoCompleteResultList.render();

			}.bind(this))

			.fail(function (e) {
				console.log(e.stack);
			})
	}

});


Object.defineProperties(StationCreateForm.prototype, {
	user:{
		get:function () {
			return this._user;
		},

		set:function (user) {
			this._user = user;
		}
	}
});

module.exports = StationCreateForm;