/** @module */

var jobOutputChecker = require('./job-output-checker');
var jobCutService = require('../vmg-services/job-cut');
var dhr = require('../vmg-helpers/dom');
var ahr = require('../vmg-helpers/app');
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

  // HandleBidInfo
  this.episodeBid = null;
};

Wsp.prototype.handleGetJobCut = function(err, jobCut) {
  if (err) {
    return this.showNotif(err);
  }

  console.log(jobCut);

  if (jobCut.id_of_job_status === 'Error') {
    // TODO: #43! recreate the job
    this.showNotif(new Error('A job is failed: ' + jobCut.status_detail + '<br>Please contact with administration'));
    return;
  }

  if (jobCut.id_of_job_status === 'Complete') {
    // Get url,
    // Change video source url
    // Hide slider
    alert('hoora');
    return;
  }

  // check one more
  window.setTimeout(this.checkJobCut.bind(this), 1500);
};

Wsp.prototype.checkJobCut = function() {
  jobCutService.getItem(this.idOfMediaSpec, this.handleGetJobCut.bind(this));
};

Wsp.prototype.handlePostJobCut = function(err, jobCut) {
  if (err) {
    return this.showNotif(err);
  }

  this.jobCut = jobCut;

  // after posting - retry with progress bar
  console.log('jobCut', jobCut);
  // TODO: #33! Change loader
  window.setTimeout(this.checkJobCut.bind(this), 1500);
};

// allow this event only full video download
// TODO: #43! Or append this event dinamically after vide downloading
// TODO: #43! Add values for start and stop points dynamically
Wsp.prototype.cutVideo = function() {
  var cuttingStart = ahr.toInt(dhr.getVal(this.esc.inpStart));
  var cuttingStop = ahr.toInt(dhr.getVal(this.esc.inpStop));
  console.log('cutting', cuttingStart, cuttingStop);
  var errValid = [];

  if (typeof cuttingStart !== 'number') {
    errValid.push('Please input a time value (in milliseconds) for a start point');
  }
  if (typeof cuttingStop !== 'number') {
    errValid.push('Please input a time value (in milliseconds) for a stop point');
  }

  // in ms
  var vdoDuration = this.vdo.duration() * 1000;
  if (cuttingStop < 0 || cuttingStart < 0) {
    errValid.push('Please input a correct value between 0 and ' + vdoDuration + ' (in milliseconds)');
  }

  if (cuttingStop > vdoDuration || cuttingStart > vdoDuration) {
    errValid.push('Please input a correct value between 0 and ' + vdoDuration + ' (in milliseconds)');
  }

  // convert seconds to ms
  var episodeDuration = ahr.toInt(this.episodeBid.episode_template_item.movie_template_item.duration_of_episodes) * 1000;
  var episodeVariation = 1000; // 1 second

  var cuttingDiff = cuttingStop - cuttingStart;

  if (cuttingDiff < (episodeDuration - episodeVariation) || cuttingDiff > (episodeDuration + episodeVariation)) {
    errValid.push('Allowed duration (difference between values): from ' + (episodeDuration - episodeVariation) + ' to ' + (episodeDuration + episodeVariation));
  }

  if (errValid.length > 0) {
    return this.showNotif(new Error(errValid.join('<br>')));
  }

  var jobCut = {
    id_of_media_spec: this.jobOutput.id_of_media_spec,
    cutting_start: cuttingStart,
    cutting_stop: cuttingStop
  };
  //    var elemCuttingStart = dhr.getElem('.' + clsNotif);
  //    var elemNotif = dhr.getElem('.' + clsNotif);
  // send it to the server
  jobCutService.postItem(jobCut, this.handlePostJobCut.bind(this));
};

Wsp.prototype.handleMetaReady = function() {
  console.log(this.vdo.duration());
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
    dhr.hideElems(this.esc.loader);
    dhr.hideElems(this.esc.player);
    return this.showNotif(err);
  }

  this.jobOutput = jobOutput;

  dhr.hideElems(this.esc.loader);
  this.showPlayer();
  //  console.log('mediaFile', mediaFile);
};

Wsp.prototype.handleBidInfo = function(err, episodeBid) {
  if (err) {
    return this.showNotif(err);
  }

  this.episodeBid = episodeBid;
  //console.log('episode bid', episodeBid);

  jobOutputChecker.run(this.idOfMediaSpec, this.handleJobOutput.bind(this));
};

Wsp.prototype.getBidInfo = function() {
  episodeBidService.getItemWithEpisodeAndMovie(this.idOfMediaSpec, this.handleBidInfo.bind(this));
};

Wsp.prototype.showNotif = function(err) {
  dhr.html(this.esc.notif, err.message);
  dhr.showElems(this.esc.notif);
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
