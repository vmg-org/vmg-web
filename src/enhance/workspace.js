/** @module */

var jobOutputChecker = require('./job-output-checker');
var jobCutService = require('../vmg-services/job-cut');
var dhr = require('../vmg-helpers/dom');
var episodeBidService = require('../vmg-services/episode-bid');

var Wsp = function(esc, idOfMediaSpec) {
  console.log('wsp', arguments);
  this.esc = esc;
  this.idOfMediaSpec = idOfMediaSpec;
  // set after CheckJobOutput
  this.jobOutput = null;

  // set after video elem initialization
  this.vdo = null;

  // handlePostJobCut
  this.jobCut = null;
};

Wsp.prototype.handlePostJobCut = function(err, jobCut) {
  if (err) {
    dhr.html(this.esc.notif, err.message);
    dhr.showElems(this.esc.notif);
    return;
  }

  this.jobCut = jobCut;

  // after posting - retry with progress bar
  console.log(err, jobCut);
};

// allow this event only full video download
// TODO: #43! Or append this event dinamically after vide downloading
// TODO: #43! Add values for start and stop points dynamically
Wsp.prototype.cutVideo = function() {
  var cuttingStart = dhr.getVal(this.esc.inpStart);
  var cuttingStop = dhr.getVal(this.esc.inpStop);

  var errValid = [];

  if (typeof cuttingStart !== 'number') {
    errValid.push('Please input a time value (in milliseconds) for a start point');
  }
  if (typeof cuttingStop !== 'number') {
    errValid.push('Please input a time value (in milliseconds) for a stop point');
  }

  // in ms
  var vdoDuration = this.vdo.duration() * 1000;

  if (cuttingStop > vdoDuration || cuttingStart > vdoDuration) {
    errValid.push('Please input a correct value between 0 and ' + vdoDuration + ' (in milliseconds)');
  }

  // TODO: #33! Check duration from episode 

  if (errValid.length > 0) {
    dhr.html(this.esc.notif, errValid.join('<br>'));
    dhr.showElems(this.esc.notif);
    return;
  }

  var jobCut = {
    id_of_media_spec: this.jobOutput.id_of_media_spec,
    cutting_start: cuttingStart,
    cuttion_stop: cuttingStop
  };

  //    var elemCuttingStart = dhr.getElem('.' + clsNotif);
  //    var elemNotif = dhr.getElem('.' + clsNotif);
  // send it to the server
  jobCutService.postItem(jobCut, this.handlePostJobCut.bind(this));
};

Wsp.prototype.handleMetaReady = function() {
  dhr.on(this.esc.fncCut, 'click', this.cutVideo.bind(this));

  // elemCutFnc onclick
  dhr.showElems(this.esc.slider);
};

// no arguments, only this
Wsp.prototype.handleVideoReady = function(vdo) {
  this.vdo = vdo;
  //  console.log('video ready', vdo);
  this.vdo.on('loadedmetadata', this.handleMetaReady.bind(this));
};

Wsp.prototype.showPlayer = function() {
  var mediaFile = this.jobOutput.media_spec_item.file_output_arr[0].media_file_item;
  dhr.showElems(this.esc.player);
  var videoElem = document.createElement('video');
  var videoSource = document.createElement('source');
  videoSource.src = mediaFile.url;
  videoSource.type = mediaFile.id_of_container_format;
  $(videoElem).addClass('video-js vjs-default-skin');
  videoElem.appendChild(videoSource);
  dhr.html(this.esc.player, videoElem);
  // Player builds using videojs and inserted a link
  var ths = this;
  window.videojs(videoElem, {
    width: '100%',
    height: '100%',
    controls: true,
    preload: true
  }, function() {
    // this = video elem created by video js
    ths.handleVideoReady(this);
  });
};

/**
 * Handle converted media file
 *     from job_output
 */
Wsp.prototype.handleJobOutput = function(err, jobOutput) {
  if (err) {
    // TODO: #33! show notif about error - job recreate here??
    dhr.html(this.esc.notif, err.message);
    dhr.showElems(this.esc.notif);
    dhr.hideElems(this.esc.loader);
    dhr.hideElems(this.esc.player);
    return;
  }

  this.jobOutput = jobOutput;

  dhr.hideElems(this.esc.loader);
  this.showPlayer();
  //  console.log('mediaFile', mediaFile);
};

Wsp.prototype.handleBidInfo = function(err, episodeBid) {
  if (err) {
    console.log(err);
    console.log('myesc', this.esc);
    dhr.html(this.esc.notif, err.message);
    dhr.showElems(this.esc.notif);
    return;
  }
  console.log('episode bid', episodeBid);

  jobOutputChecker.run(this.idOfMediaSpec, this.handleJobOutput.bind(this));
};

Wsp.prototype.getBidInfo = function() {
  episodeBidService.getItemWithEpisodeAndMovie(this.idOfMediaSpec, this.handleBidInfo.bind(this));
};

exports.init = function() {
  // add methods
  var obj = Object.create(Wsp.prototype);
  // add props
  Wsp.apply(obj, arguments);
  // return created object
  return obj;
  //  return new Wsp.bind(this, arguments);
};

module.exports = exports;
