exports.levels = (function () {
	var q = require('q'), fs = require('fs'), Sequelize = require("sequelize");

	return {
		loadConfig: function () {
			var deferred = q.defer();

			fs.readFile('config/levels.json', 'utf-8', function (err, data) {
				var config = JSON.parse(data);
				this.config = config;

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