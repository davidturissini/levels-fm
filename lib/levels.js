exports.levels = (function () {
	var q = require('q'), fs = require('fs'), Sequelize = require("sequelize");

	return {

		Class: function (prototype) {

			function generatedClass(options) {
				this.attributes = options || {};
			}

			prototype = exports.levels.Object.extend({

				get: function (prop) {
					return this.attributes[prop];
				},

				set: function (prop, val) {
					this.attributes[prop] = val;
				}

			}, prototype);

			generatedClass.prototype = prototype;

			return generatedClass;
		},

		Object: {

			extend: function(obj1, obj2) {
				var x;

				for (x in obj2) {
					if (obj2.hasOwnProperty(x)) {
						obj1[x] = obj2[x];
					}
				}

				return obj1;

			}

		},

		loadConfig: function () {
			var deferred = q.defer();

			fs.readFile('config/levels.json', 'utf-8', function (err, data) {
				var config = JSON.parse(data);
				this.config = config;

				GLOBAL.CONFIG = this.config;
				deferred.resolve(config);
			}.bind(this));

			return deferred.promise;
		},
		initializeDatabase: function () {
			var config = this.config.database;

			this.pg = new Sequelize(config.database, config.username, config.password, {
			  host: config.host,
			  dialect: config.dialect
			})
		},
		init: function () {
			return this.loadConfig()
				.then(function (data) {
					this.initializeDatabase();
				}.bind(this));
		}
	};

}());