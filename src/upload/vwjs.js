/** @module upload/vwjs */
'use strict';


var fileUploader = require('./file-uploader');
var dhr = require('../vmg-helpers/dom');
var demoBid = require('./demo-bid');
var credUpload = require('./cred-upload');

var cbkFileUpload = function(jobSource, files, rejected) {
  console.log('send begin', jobSource);
  //  return;
  window.FileAPI.upload({
    url: jobSource.url_to_upload,
    data: JSON.parse(jobSource.url_to_read),
    files: {
      file: files[0]
    },
    cache: true // remove query string from a request - it is required for S3
  });
};

var cbkCredUpload = function(files, err, jobSource) {
  if (err) {
    alert('credError');
    console.log(err);
    return;
  }

  if (!jobSource) {
    alert('noSuchJob');
    return;
  }

  window.FileAPI.filterFiles(files, function(file, info /**Object*/ ) {
    console.log(info);
    return true;
  }, cbkFileUpload.bind(null, jobSource));
};

var handleFileSelector = function(evt) {
  var files = window.FileAPI.getFiles(evt); // Retrieve file list
  var needFile = files[0];
  console.log(needFile);
  console.log('evt', evt);
  var demoIdOfMediaSpec = parseInt(window.location.hash.substr(1));
  credUpload.run({
    id_of_media_spec: demoIdOfMediaSpec, //from hash
    id_of_container_format: needFile.type
  }, cbkCredUpload.bind(null, files));
};

// bem - second
exports.run = function(app) {
  app.fireFileSelector = function(elem, e, fileSelectorName) {
    console.log('fire', fileSelectorName);
    // todo: #43! disable from double click
    var fileSelectorElem = dhr.getElem('.' + fileSelectorName);
    window.FileAPI.event.on(fileSelectorElem, 'change', handleFileSelector);
    // attach event and fired

    dhr.trigger('.' + fileSelectorName, 'click');
  };
  // after selection of a file
  app.handleUpload = function(elem) {
    console.log('handle upload', elem.files);
    //console.log(elem.files);
    //    var uplPlayer = elem.getAttribute('data-player');
    //    var uplSelector = elem.getAttribute('data-selector');
    //
    //    fileUploader.run(elem.files[0], uplPlayer, uplSelector);
  };

  app.handleDropFile = function(elem, e) {
    e.stopPropagation();
    e.preventDefault();

    var dt = e.dataTransfer;
    var files = dt.files;
    console.log(files);

    //  'data-player': 'upl-player', // show it
    //  'data-selector': 'upl-selector' // hide it			 
    var uplPlayer = elem.getAttribute('data-player');
    var uplSelector = elem.getAttribute('data-selector');

    fileUploader.run(files[0], uplPlayer, uplSelector);
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
