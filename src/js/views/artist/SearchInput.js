var soundcloud = require('./../../services/soundcloud');
var EventEmitter = require('events').EventEmitter;
var Artist = require('./../../model/Artist');
var backbone = require('backbone');


var ArtistSearchField = backbone.View.extend({

	tagName:'input',

	className:'name-input',

	events: {
		'keyup' : 'onKeyUp'
	},

	attributes:{
		type:'text',
		placeholder:'Create new station'
	},

	onKeyUp: function (evt) {
		var element = this.el;

		window.clearTimeout(this._keyUpTimeout);

		if (evt.keyCode === 27) {
			return;
		}

		this._keyUpTimeout = window.setTimeout(function () {

			soundcloud.get('/users', {
				q:element.value
			})

			.then(function (results) {
				var spliced = results.splice(0, 5);
				this.model.reset(spliced);
			}.bind(this))

			.fail(function (e) {
				console.log(e.stack);
			});

		}.bind(this), 400);
	}

});


/*
function ArtistSearchField (el) {
	this._element = el;
	this._keyUpTimeout;
};

var proto = ArtistSearchField.prototype = Object.create(EventEmitter.prototype);

proto.value = function () {
	return this._element.value;
};

proto.onKeyUp = function () {
	var element = this._element;

	window.clearTimeout(this._keyUpTimeout);
	this._keyUpTimeout = window.setTimeout(function () {

		soundcloud.get('/users', {
			q:element.value
		})

		.then(function (results) {

			return results.map(function (result) {
				return new Artist(result);
			});
		})

		.then(this.emit.bind(this, 'results'))

		.fail(function (e) {
			console.log(e.stack);
		});

	}.bind(this), 400);
	
};
*/

module.exports = ArtistSearchField;