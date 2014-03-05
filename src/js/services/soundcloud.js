var soundcloud = require('soundcloud').soundcloud;

var soundcloudClientId = '99308a0184193d62e064cb770f4c1eae';

soundcloud.configure({
	client_id:soundcloudClientId
});

exports.get = soundcloud.api;

exports.buildStreamUrl = function (track) {
	return track.get('stream_url') + '?client_id=' + soundcloudClientId;
}