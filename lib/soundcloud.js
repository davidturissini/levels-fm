exports.sc = (function () {
	var _config, querystring = require('querystring'), http = require('http'), q = require('q'), baseUrl = 'api.soundcloud.com';

	function makeRequest(path, requestOptions) {
		var deferred = q.defer(), options = requestOptions || {}, url;

		options.client_id = _config.client_id;
		url = 'http://' + baseUrl + path + '.json?' + querystring.stringify(options);

		http.get(url, function (resp) {
			var data = '';

			resp.on('data', function (chunk) {
				data += chunk;
			});

			resp.on('end', function(){
				var json = JSON.parse(data);

				deferred.resolve(json);
			})
		});

		return deferred.promise;
	};

	return {

		setConfig: function (config) {
			_config = config;
		},

		get: function (path, options) {
			return makeRequest(path, options);
		}

	}
	

}());