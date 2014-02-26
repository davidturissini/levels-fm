var pigeon = require('pigeon');
var domain = /*'http://localhost:3000';*/ 'http://levelsfm-backend.herokuapp.com';

var fetch = exports.get = function (path, params, method) {
	method = method || 'get';

	return pigeon[method](domain + path, params || {})
			.then(function (e) {
				return JSON.parse(e);
			});
}

exports.get = fetch;

exports.del = function (path, params) {
	return fetch(path, params, 'del');
}

exports.post = function (path, params) {
	return fetch(path, params, 'post');
}