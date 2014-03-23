var pigeon = require('pigeon');

module.exports = {

	get:function (path) {
		return pigeon.get('/html/' + path + '.html'); 
	}

}