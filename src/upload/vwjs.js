/**
 * @module upload/vwjs
 * @todo: #42! check accept-types in file-input, to check only video/*
 */
'use strict';

var dhr = require('../vmg-helpers/dom');
var demoBid = require('./demo-bid');
var fileHandler = require('./file-handler');
var jobSourceChecker = require('./job-source-checker');

/**
 * Handle output job
 * @param {Object} jobOutput - A job is created (for conversion a source file to outputs)
 */
var handleJob = function(elemLoader, err, jobOutput) {
  if (err) {
    console.log('error', err);
    return alert(err.message);
  }

  console.log('handleJob', jobOutput);
  window.location.replace('./enhance.html?v=' + jobOutput.id_of_media_spec);
};

var handleResultOfUpload = function(elemSelector, elemLoader, elemNotif, err, jobSource) {
  if (err) {
    dhr.html(elemNotif, err.message);
    dhr.showElems(elemNotif);
    // show again to choose another file
    dhr.hideElems(elemLoader);
    dhr.showElems(elemSelector);
    // TODO: #34! handle this error: update a page for user, try again with remove previous job_source in some cases?
    return;
  }

  dhr.html(elemLoader, 'verification of an uploaded file...');
  jobSourceChecker.run(jobSource, handleJob.bind(null, elemLoader));
};

// bem - second
exports.run = function(app) {
  // Event to select of dnd files
  app.initUpload = function(elem, e, uplSelector, uplSelectorInput, uplLoader, uplNotif) {
    var elemSelector = dhr.getElem('.' + uplSelector);
    var elemSelectorInput = dhr.getElem('.' + uplSelectorInput);
    var elemLoader = dhr.getElem('.' + uplLoader);
    var elemNotif = dhr.getElem('.' + uplNotif);

    window.FileAPI.event.on(elemSelectorInput, 'change', function(evt) {
      var files = window.FileAPI.getFiles(evt); // Retrieve file list
      dhr.hideElems(elemSelector);
      dhr.showElems(elemLoader);
      fileHandler.run(files, elemLoader, handleResultOfUpload.bind(null, elemSelector, elemLoader, elemNotif));
    });

    window.FileAPI.event.dnd(elemSelector, function(over) {
      elemSelector.style.backgroundColor = over ? '#ffb' : '';
    }, function(files) {
      dhr.hideElems(elemSelector);
      dhr.showElems(elemLoader);
      fileHandler.run(files, elemLoader, handleResultOfUpload.bind(null, elemSelector, elemLoader, elemNotif));
    });
  };

  app.fireFileSelector = function(elem, e, uplSelectorInput) {
    dhr.trigger('.' + uplSelectorInput, 'click');
  };

  // add test episode-bid
  demoBid.run();
};

module.exports = exports;

// https://github.com/videojs/video.js/blob/stable/docs/guides/api.md
//var handleVideoReady = function() {
//  var myPlayer = this;
//
//  console.log(myPlayer);
//  // myPlayer.currentTime(120);
//  /// myPlayer.play();
//
//  //The video must have started loading before the duration can be known, and in the case of Flash, may not be known until the video starts playing.
//  // seconds
//  //
//  // loadstart
//  //
//  myPlayer.onLoadStart(function() {
//    console.log(myPlayer.duration());
//  });
//};
// redirect to enhance

//  var videoElem = document.createElement('video');
//  var videoSource = document.createElement('source');
//  videoSource.src = mediaFile.url;
//  videoSource.type = 'video/mp4';
//  $(videoElem).addClass('video-js vjs-default-skin');
//  videoElem.appendChild(videoSource);
//  $('.' + ).html(videoElem);
//  // Player builds using videojs and inserted a link
//  window.videojs(videoElem, {
//    width: '100%',
//    height: '100%',
//    controls: true,
//    preload: true
//  }, handleVideoReady);
// after selection of a file
//  app.handleUpload = function(elem) {
//    //    console.log('handle upload', elem.files);
//    var uplSelector = elem.getAttribute('data-selector');
//    dhr.hideElems('.' + uplSelector);
//    //console.log(elem.files);
//    var uplLoader = elem.getAttribute('data-upl-loader');
//    dhr.showElems('.' + uplLoader);
//  };
