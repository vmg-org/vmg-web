/**
 * @module
 * @todo: #42! check accept-types in file-input, to check only video
 */
'use strict';
var dhr = require('../vmg-helpers/dom');
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

// To show max duration - need to get BidInfo
// Limit by filesize: 15s - 50MB 30s- 100MB
// Event to select of dnd files
exports.attachUploadEvents = function(next) {
  var elemSelector = dhr.getElem('.' + this.cls.selector);
  var elemSelectorInput = dhr.getElem('.' + this.cls.selectorInput);
  var elemLoader = dhr.getElem('.' + this.cls.loader);
  var elemNotif = dhr.getElem('.' + this.cls.notif);

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

  next();
};

exports.attachSelectorEvents = function(next) {

  var cls = this.cls;
  var elemOpener = dhr.getElem('.' + this.cls.opener);
  // when click on opener - fire click on input
  dhr.on(elemOpener, 'click', function() {
    dhr.trigger('.' + cls.selectorInput, 'click');
  });

  dhr.showElems('.' + this.cls.selector);

  next();
};

exports.waitDocReady = function(next) {
  $(this.doc).ready(next);
};

module.exports = exports;
