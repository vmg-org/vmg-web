/**
 * @module
 */
'use strict';

var jobOutputChecker = require('./job-output-checker');
var jobCutService = require('../vmg-services/job-cut');
var dhr = require('../vmg-helpers/dom');

var handlePostJobCut = function(esc, err, jobCut) {
  if (err) {
    dhr.html(esc.notif, err.message);
    dhr.showElems(esc.notif);
    return;
  }

  // after posting - retry with progress bar
  console.log(err, jobCut);
};

// allow this event only full video download
// TODO: #43! Or append this event dinamically after vide downloading
// TODO: #43! Add values for start and stop points dynamically
var cutVideo = function(esc, jobOutput) {
  var cuttingStart = dhr.getVal(esc.inpStart);
  var cuttingStop = dhr.getVal(esc.inpStop);

  var errValid = [];

  if (typeof cuttingStart !== 'number') {
    errValid.push('Please input a time value (in milliseconds) for a start point');
  }
  if (typeof cuttingStop !== 'number') {
    errValid.push('Please input a time value (in milliseconds) for a stop point');
  }

  if (errValid.length > 0) {
    dhr.html(esc.notif, errValid.join('<br>'));
    dhr.showElems(esc.notif);
    return;
  }

  // TODO: #33! Check duration limits
  var jobCut = {
    id_of_media_spec: jobOutput.id_of_media_spec,
    cutting_start: cuttingStart,
    cuttion_stop: cuttingStop
  };

  //    var elemCuttingStart = dhr.getElem('.' + clsNotif);
  //    var elemNotif = dhr.getElem('.' + clsNotif);
  // send it to the server
  jobCutService.postItem(jobCut, handlePostJobCut.bind(null, esc));
};

var handleMetaReady = function(esc, jobOutput) {
  dhr.on(esc.fncCut, 'click', cutVideo.bind(null, esc, jobOutput));

  // elemCutFnc onclick
  dhr.showElems(esc.slider);
};

// no arguments, only this
var handleVideoReady = function(vdo, esc, jobOutput) {
  console.log('video ready', vdo);
  vdo.on('loadedmetadata', handleMetaReady.bind(null, esc, jobOutput));
};

var showPlayer = function(esc, jobOutput) {
  var mediaFile = jobOutput.media_spec_item.file_output_arr[0].media_file_item;
  dhr.showElems(esc.player);
  var videoElem = document.createElement('video');
  var videoSource = document.createElement('source');
  videoSource.src = mediaFile.url;
  videoSource.type = mediaFile.id_of_container_format;
  $(videoElem).addClass('video-js vjs-default-skin');
  videoElem.appendChild(videoSource);
  dhr.html(esc.player, videoElem);
  // Player builds using videojs and inserted a link
  window.videojs(videoElem, {
    width: '100%',
    height: '100%',
    controls: true,
    preload: true
  }, function() {
    // this = video elem created by video js
    handleVideoReady(this, esc, jobOutput);
  });
};

/**
 * Handle converted media file
 *     from job_output
 */
var handleJobOutput = function(esc, err, jobOutput) {
  if (err) {
    // TODO: #33! show notif about error - job recreate here??
    dhr.html(esc.notif, err.message);
    dhr.showElems(esc.notif);
    dhr.hideElems(esc.loader);
    dhr.hideElems(esc.player);
    return;
  }

  dhr.hideElems(esc.loader);
  showPlayer(esc, jobOutput);
  //  console.log('mediaFile', mediaFile);
};


exports.run = function(app, bem, idOfMediaSpec) {
  console.log('idOfMediaSpec', idOfMediaSpec);

  app.checkConversion = function(elem, e, clsLoader, clsPlayer, clsSlider, clsFncCut, clsInpStart, clsInpStop, clsNotif) {
    var elemScope = {
      notif: dhr.getElem('.' + clsNotif),
      loader: dhr.getElem('.' + clsLoader),
      player: dhr.getElem('.' + clsPlayer),
      slider: dhr.getElem('.' + clsSlider),
      fncCut: dhr.getElem('.' + clsFncCut),
      inpStart: dhr.getElem('.' + clsInpStart),
      inpStop: dhr.getElem('.' + clsInpStop)
    };

    jobOutputChecker.run(idOfMediaSpec, handleJobOutput.bind(null, elemScope));
  };

};

module.exports = exports;
