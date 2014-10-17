/** @module upload/vwjs */
'use strict';

var dhr = require('../vmg-helpers/dom');
var demoBid = require('./demo-bid');
var fileHandler = require('./file-handler');
var jobSourceChecker = require('./job-source-checker');

var handleJob = function(uplPlayer, err, mediaFile) {
  console.log('handleJob');
  if (err) {
    console.log('error', err);
    return alert(err.message);
  }
  var videoElem = document.createElement('video');
  var videoSource = document.createElement('source');
  videoSource.src = mediaFile.url;
  videoSource.type = 'video/mp4';
  $(videoElem).addClass('video-js vjs-default-skin');
  videoElem.appendChild(videoSource);
  $('.' + uplPlayer).html(videoElem);
  // Player builds using videojs and inserted a link
  window.videojs(videoElem, {
    width: '100%',
    height: '100%',
    controls: true
  }, function() {
    console.log('player is loaded');
  });
};

var handleResultOfUpload = function(jobSource, err, xhr) {
  console.log('resultofupload', jobSource, err, xhr);

  // TODO: #32! From markup
  var uplPlayer = 'upl-player';
  $('.' + uplPlayer).html('Conversion started...');
  jobSourceChecker.run(jobSource, handleJob.bind(null, uplPlayer));
};

// bem - second
exports.run = function(app) {
  app.fireFileSelector = function(elem, e, fileSelectorName) {
    console.log('fire', fileSelectorName);
    // todo: #43! disable from double click
    var fileSelectorElem = dhr.getElem('.' + fileSelectorName);
    window.FileAPI.event.on(fileSelectorElem, 'change', fileHandler.handleFileSelector.bind(null, handleResultOfUpload));
    // attach event and fired

    dhr.trigger('.' + fileSelectorName, 'click');
  };

  // after selection of a file
  app.handleUpload = function(elem) {
    //    console.log('handle upload', elem.files);
    var uplSelector = elem.getAttribute('data-selector');
    dhr.hideElems('.' + uplSelector);
    //console.log(elem.files);
    var uplPlayer = elem.getAttribute('data-player');
    dhr.showElems('.' + uplPlayer);
    //
    //    fileUploader.run(elem.files[0], uplPlayer, uplSelector);
  };

  app.handleDropFile = function(elem, e) {
    e.stopPropagation();
    e.preventDefault();
    // TODO: 43! Using FILE API
    //    var dt = e.dataTransfer;
    //    var files = dt.files;
    //    console.log(files);
    //
    //    //  'data-player': 'upl-player', // show it
    //    //  'data-selector': 'upl-selector' // hide it			 
    //    var uplPlayer = elem.getAttribute('data-player');
    //    var uplSelector = elem.getAttribute('data-selector');
    //
    //    fileUploader.run(files[0], uplPlayer, uplSelector);
  };

  app.handleDragEnterFile = function(elem, e) {
    e.stopPropagation();
    e.preventDefault();
    //    console.log(elem, e);
  };

  app.handleDragOverFile = function(elem, e) {
    e.stopPropagation();
    e.preventDefault();
    //    console.log(elem, e);
  };

  // add test episode-bid
  demoBid.run();
};

module.exports = exports;
