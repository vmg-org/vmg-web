/** 
 * @todo: #24! Get duration of video to cut; start and stop; with or without loading full video
 * @todo: #34! Load episode info
 *             movie_template.name, .duration_of_episodes,
 *             episode_template.name, story, conds, order_in_movie
 *             media_spec
 *             job_output.id_of_job_status, status_detail
 *             file_output_arr
 *             media_file.url, .size, .duration
 * @todo: #33! Show media url (when a job is ready);
 * @todo: #33! Show cutline with start, stop points
 *             After submit, send a request with start, stop points to crete job_cut
 *             Check this job every N seconds, while status = 'Complete' (set media_spec.is_ready = true)
 *             Re-load the video (with this url): cutted video already
 * @module
 */

var jobOutputChecker = require('./job-output-checker');
var dhr = require('../vmg-helpers/dom');
var ahr = require('../vmg-helpers/app');
var srv = require('../vmg-services/srv');
var pblWorkspace = require('../common/workspace');
var cls = require('./cls');
var bem = require('../../../vmg-bem/bems/enhance.bemjson');

var Mdl = function(zpath) {
  console.log('wsp', arguments);
  pblWorkspace.apply(this, [cls]);
  this.zpath = zpath;
  this.esc = {
    notif: dhr.getElem('.' + this.cls.notif),
    loader: dhr.getElem('.' + this.cls.loader),
    player: dhr.getElem('.' + this.cls.player),
    slider: dhr.getElem('.' + this.cls.slider),
    fncCut: dhr.getElem('.' + this.cls.fncCut),
    inpStart: dhr.getElem('.' + this.cls.inpStart),
    inpStop: dhr.getElem('.' + this.cls.inpStop)
  };
  this.bem = bem;
  this.idOfMediaSpec = null;
  // set after CheckJobOutput
  this.jobOutput = null;

  // set after video elem initialization
  this.vdo = null;

  // handlePostJobCut
  this.jobCut = null;

  // HandleBidInfo
  this.episodeBid = null;
};

ahr.inherits(Mdl, pblWorkspace);

Mdl.prototype.handleGetJobCut = function(err, jobCut) {
  if (err) {
    return this.showNotif(err);
  }

  console.log(jobCut);

  if (jobCut.id_of_job_status === 'Error') {
    // TODO: #43! recreate the job
    this.showNotif(new Error('A job is failed: ' + jobCut.status_detail + '<br>Please contact with administration'));
    return;
  }
  //https://github.com/videojs/video.js/blob/stable/docs/api/vjs.Player.md
  if (jobCut.id_of_job_status === 'Complete') {
    window.location.href = './cabinet.html';

    //    var needMediaFileCut = jobCut.media_spec_item.file_cut_arr[0].media_file_item;
    //    this.vdo.src(needMediaFileCut.url);
    //
    //    dhr.hideElems(this.esc.loader);
    //    dhr.showElems(this.esc.player);
    // TODO: #33! Show button to attach video to episode   
    // And remove cutted version, to cut again from source (in future);
    // Get url,
    // Change video source url
    // Hide slider
    return;
  }

  // check one more
  window.setTimeout(this.checkJobCut.bind(this), 1500);
};

Mdl.prototype.checkJobCut = function() {
  srv.r1007(this.idOfMediaSpec, this.handleGetJobCut.bind(this));
};

Mdl.prototype.handlePostJobCut = function(err, jobCut) {
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
Mdl.prototype.cutVideo = function() {
  // hide prev errors
  dhr.hideElems(this.esc.notif);
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


  // hide player, show loader
  dhr.hideElems(this.esc.player);
  dhr.hideElems(this.esc.slider);
  dhr.html(this.esc.loader, 'processing...');
  dhr.showElems(this.esc.loader);

  var jobCut = {
    id_of_media_spec: this.jobOutput.id_of_media_spec,
    cutting_start: cuttingStart,
    cutting_stop: cuttingStop
  };
  //    var elemCuttingStart = dhr.getElem('.' + clsNotif);
  //    var elemNotif = dhr.getElem('.' + clsNotif);
  // send it to the server
  srv.w2005(jobCut, this.handlePostJobCut.bind(this));
};

Mdl.prototype.handleMetaReady = function() {
  console.log(this.vdo.duration());
  dhr.on(this.esc.fncCut, 'click', this.cutVideo.bind(this));

  // elemCutFnc onclick
  dhr.showElems(this.esc.slider);
};

// no arguments, only this
Mdl.prototype.handleVideoReady = function(vdo) {
  this.vdo = vdo;
  //  console.log('video ready', vdo);
  // Show slider only once: when page is loaded
  // Don't show after cutting  
  this.vdo.one('loadedmetadata', this.handleMetaReady.bind(this));
};

Mdl.prototype.showPlayer = function() {
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
Mdl.prototype.handleJobOutput = function(err, jobOutput) {
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

Mdl.prototype.handleBidInfo = function(err, episodeBid) {
  if (err) {
    return this.showNotif(err);
  }

  this.episodeBid = episodeBid;
  //console.log('episode bid', episodeBid);

  jobOutputChecker.run(this.idOfMediaSpec, this.handleJobOutput.bind(this));
};

Mdl.prototype.getBidInfo = function() {
  srv.r1008(this.idOfMediaSpec, this.handleBidInfo.bind(this));
};

Mdl.prototype.showNotif = function(err) {
  dhr.html(this.esc.notif, err.message);
  dhr.showElems(this.esc.notif);
};

Mdl.prototype.loadIdOfMediaSpec = function(next) {
  var mParam = ahr.getQueryParam('m');
  mParam = ahr.toInt(mParam);

  if (!mParam) {
    alert('No param in url: ?m=123 as integer');
    return;
  }

  this.idOfMediaSpec = mParam;
  next();
};

Mdl.prototype.authFlowSelector = function() {
  if (this.userSession) {
    this.userSession.showAuth(this.last);
    this.getBidInfo();
  } else {
    var authNoFlow =
      this.waitUserLogin.bind(this,
        this.reloadPage.bind(this)
      );
    // show message and apply events and login buttons with authFlow
    authNoFlow();
  }
};

Mdl.prototype.startFlow = function() {
  var appFlow =
    this.loadIdOfMediaSpec.bind(this,
      this.waitDocReady.bind(this,
        this.addEvents.bind(this,
          this.loadSid.bind(this,
            // two flows - auth=yes and auth=no
            this.handleSid.bind(this,
              this.authFlowSelector.bind(this)
            )))));

  appFlow();
};

exports.init = function() {
  // add methods
  var obj = Object.create(Mdl.prototype);
  // add props
  Mdl.apply(obj, arguments);
  // return created object
  return obj;
  //  return new Mdl.bind(this, arguments);
};

module.exports = exports;
