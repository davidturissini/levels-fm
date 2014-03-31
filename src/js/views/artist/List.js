var backbone = require('backbone');
var mustache = require('mustache');
var template = require('./../../services/templates');
var q = require('q');

var ArtistList = backbone.View.extend({

	getTemplateString:function () {
		return template.get('artist/_list');
	},

	tagName: 'ul',

	className: 'artist-list',

	initialize: function () {
		this.listenTo(this.model, 'reset', this.onReset);
	},

	onReset: function () {
		this.drawAll();
	},

	drawAll: function () {
		this.$el.empty();
		this.getTemplateString()
			.then(function (str) {
				var render = mustache.render(str, this.model);
				this.$el.html(render);

			}.bind(this));
		
	},

	render: function () {
		this.drawAll();
		

	}

});

module.exports = ArtistList;