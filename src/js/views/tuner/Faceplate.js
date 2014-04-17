var PlayPauseButton = require('./../player/PlayPauseButton');
var Progress = require('./../player/Progress');
var Time = require('./../player/TrackTime');
var SkipButton = require('./../player/SkipButton');
var TrackMeta = require('./../player/TrackMeta');
var VoteUpButton = require('./../player/VoteUpButton');
var VoteDownButton = require('./../player/VoteDownButton');
//var StationList = require('./StationList');

function TunerFaceplate (element, tuner, options) {
	options = options || {};

	this._tuner = tuner;

	
	var playPauseButton = options.playPauseButton || new PlayPauseButton(element.querySelector('#playPause'), this._tuner.player);
	var progress = options.progress || new Progress(element.querySelector('#progress'), this._tuner.player);
	var time = options.time || new Time(element.querySelector('#time'), this._tuner.player);
	var trackMeta = options.trackMeta || new TrackMeta(element.querySelector('#trackmeta'), this._tuner.player);
	var skipButton = options.skipButton || new SkipButton(element.querySelector('#skip'), this._tuner);
	var voteUpButton = options.voteUpButton || new VoteUpButton(element.querySelector('#voteup'), this._tuner);
	var voteDownButton = options.voteDownButton || new VoteDownButton(element.querySelector('#votedown'), this._tuner);
	//var stationList = options.stationList || new StationList(element.querySelector('#stations'), this._tuner);

}


TunerFaceplate.prototype = {

	

};

module.exports = TunerFaceplate;