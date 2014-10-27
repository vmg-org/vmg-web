/**
 * Handle files from input field (or drag and drop)
 *     Retrieves signature and other fields from server
 *     and uploads a file to a cloud
 *     Returns status of upload
 * @module
 */
'use strict';

var srv = require('../vmg-services/srv');
var config = require('../config');

var handleProgress = function(elemLoader, evt) {
  var pr = parseInt((evt.loaded / evt.total) * 100);
  // TODO: #33! Get link to player from markup
  $(elemLoader).html('loading, % ' + pr + '<br>loaded, KB: ' + parseInt(evt.loaded / 1024) +
    ' <br>total, KB: ' + parseInt(evt.total / 1024));
};

var handleComplete = function(jobSource, next, err, xhr) {
  console.log('handle-complete-xhr', xhr);
  next(err, jobSource);
};

var cbkFileUpload = function(jobSource, elemLoader, next, files, rejected) {
  var needFile = files[0];
  if (!needFile) {
    return next(new Error('Required: file'));
  }
  console.log('send begin', jobSource, rejected);
  //  return;
  window.FileAPI.upload({
    url: jobSource.url_to_upload,
    data: JSON.parse(jobSource.url_to_read),
    files: {
      file: needFile
    },
    cache: true, // remove query string from a request - it is required for S3
    complete: handleComplete.bind(null, jobSource, next),
    progress: handleProgress.bind(null, elemLoader)
  });
};

var cbkCredUpload = function(files, elemLoader, next, err, jobSource) {
  if (err) {
    next(new Error('Server error: can not get an url to upload'));
    console.log(err);
    return;
  }

  if (!jobSource) {
    // TODO: #43! when this error occurs? condition?
    next(new Error('Server error: no job'));
    return;
  }
  window.FileAPI.filterFiles(files, function() {
    // params: file, info
    // skip all files, real check in early stage
    return true;
  }, cbkFileUpload.bind(null, jobSource, elemLoader, next));
};

/**
 * Handle
 * @param {Object} evt - event from input selector or drag and drop
 */
exports.run = function(files, elemLoader, idOfMediaSpec, next) {
  //  var files = window.FileAPI.getFiles(evt); // Retrieve file list
  var needFile = files[0];
  if (!needFile) {
    return next(new Error('Required: file'));
  }

  if (!needFile.type) {
    return next(new Error('Required: type of a file'));
  }

  if (config.FILE_FORMAT_ARR.indexOf(needFile.type) === -1) {
    return next(new Error('Allowed formats: ' + config.FILE_FORMAT_ARR.join(', ')));
  }

  if (needFile.size > config.FILE_MAX_SIZE) {
    return next(new Error('Max size of a file: ' + config.FILE_MAX_SIZE));
  }

  if (needFile.size < config.FILE_MIN_SIZE) {
    return next(new Error('Min size of a file: ' + config.FILE_MIN_SIZE));
  }

  console.log(needFile);
//  var demoIdOfMediaSpec = parseInt(window.location.hash.substr(1));

  var jobSourceItem = {
    id_of_media_spec: idOfMediaSpec, //from hash
    id_of_container_format: needFile.type
  };

  srv.w2003(jobSourceItem, cbkCredUpload.bind(null, files, elemLoader, next));
};

module.exports = exports;
