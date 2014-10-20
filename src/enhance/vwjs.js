/**
 * @module
 */
'use strict';

var jobOutputChecker = require('./job-output-checker');
var jobCutService = require('../vmg-services/job-cut');
var dhr = require('../vmg-helpers/dom');

var handleVideoReady = function() {
  console.log('video ready');
};

var showPlayer = function(elemPlayer, mediaFile) {
  dhr.showElems(elemPlayer);
  var videoElem = document.createElement('video');
  var videoSource = document.createElement('source');
  videoSource.src = mediaFile.url;
  videoSource.type = mediaFile.id_of_container_format;
  $(videoElem).addClass('video-js vjs-default-skin');
  videoElem.appendChild(videoSource);
  dhr.html(elemPlayer, videoElem);
  // Player builds using videojs and inserted a link
  window.videojs(videoElem, {
    width: '100%',
    height: '100%',
    controls: true,
    preload: true
  }, handleVideoReady);
};

/**
 * Handle converted media file
 *     from job_output
 */
var handleMediaFile = function(elemLoader, elemPlayer, elemNotif, err, mediaFile) {
  if (err) {
    // TODO: #33! show notif about error - job recreate here??
    dhr.html(elemNotif, err.message);
    dhr.showElems(elemNotif);
    dhr.hideElems(elemLoader);
    dhr.hideElems(elemPlayer);
    return;
  }

  dhr.hideElems(elemLoader);
  showPlayer(elemPlayer, mediaFile);
  console.log('mediaFile', mediaFile);
};

var hanlePostJobCut = function(elemNotif, err, jobCut) {
  if (err) {
    dhr.html(elemNotif, err.message);
    dhr.showElems(elemNotif);
    return;
  }

  // after posting - retry with progress bar
  console.log(err, jobCut);
};

exports.run = function(app, bem, idOfMediaSpec) {
  console.log('idOfMediaSpec', idOfMediaSpec);

  app.checkConversion = function(elem, e, clsLoader, clsPlayer, clsNotif) {
    var elemNotif = dhr.getElem('.' + clsNotif);
    var elemLoader = dhr.getElem('.' + clsLoader);
    var elemPlayer = dhr.getElem('.' + clsPlayer);

    jobOutputChecker.run(idOfMediaSpec, handleMediaFile.bind(null, elemLoader, elemPlayer, elemNotif));
  };

  // allow this event only full video download
  // TODO: #43! Or append this event dinamically after vide downloading
  app.cutVideo = function(elem, e, clsNotif) {
    console.log(elem);
    var jobCut = {
      id_of_media_spec: idOfMediaSpec,
      cutting_start: 4400, //ms - get from elem
      cuttion_stop: 19400 //ms
    };

    var elemNotif = dhr.getElem('.' + clsNotif);
    // send it to the server
    jobCutService.postItem(jobCut, hanlePostJobCut.bind(null, elemNotif));
  };
};

module.exports = exports;
