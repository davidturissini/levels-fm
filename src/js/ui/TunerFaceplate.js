var PlayPauseButton = require('./PlayPauseButton');
var Progress = require('./Progress');
var Time = require('./TrackTime');
var SkipButton = require('./SkipButton');
var TrackMeta = require('./TrackMeta');
var VoteUpButton = require('./VoteUpButton');
var VoteDownButton = require('./VoteDownButton');
var StationList = require('./StationList');

function TunerFaceplate (tuner, options) {
	options = options || {};

	this._tuner = tuner;

	
	var playPauseButton = options.playPauseButton || new PlayPauseButton(document.getElementById('playPause'), this._tuner.player);
	var progress = options.progress || new Progress(document.getElementById('progress'), this._tuner.player);
	var time = options.time || new Time(document.getElementById('time'), this._tuner.player);
	var trackMeta = options.trackMeta || new TrackMeta(document.getElementById('trackmeta'), this._tuner.player);
	var skipButton = options.skipButton || new SkipButton(document.getElementById('skip'), this._tuner);
	var voteUpButton = options.voteUpButton || new VoteUpButton(document.getElementById('voteup'), this._tuner);
	var voteDownButton = options.voteDownButton || new VoteDownButton(document.getElementById('votedown'), this._tuner);
	var stationList = options.stationList || new StationList(document.getElementById('stations'), this._tuner);

}


TunerFaceplate.prototype = {

	

};

module.exports = TunerFaceplate;