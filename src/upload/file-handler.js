/**
 * Handle files from input field (or drag and drop)
 *     Retrieves signature and other fields from server
 *     and uploads a file to a cloud
 *     Returns status of upload
 * @module
 */
'use strict';

var jobSourceService = require('../vmg-services/job-source');

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
  console.log('send begin', jobSource, rejected);
  //  return;
  window.FileAPI.upload({
    url: jobSource.url_to_upload,
    data: JSON.parse(jobSource.url_to_read),
    files: {
      file: files[0]
    },
    cache: true, // remove query string from a request - it is required for S3
    complete: handleComplete.bind(null, jobSource, next),
    progress: handleProgress.bind(null, elemLoader)
  });
};

var cbkCredUpload = function(files, elemLoader, next, err, jobSource) {
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
    console.log('file info during filter: ', info);
    return true;
  }, cbkFileUpload.bind(null, jobSource, elemLoader, next));
};

/**
 * Handle
 * @param {Object} evt - event from input selector or drag and drop
 */
exports.run = function(files, elemLoader, next) {
  //  var files = window.FileAPI.getFiles(evt); // Retrieve file list
  var needFile = files[0];
  console.log(needFile);
  var demoIdOfMediaSpec = parseInt(window.location.hash.substr(1));

  var jobSourceItem = {
    id_of_media_spec: demoIdOfMediaSpec, //from hash
    id_of_container_format: needFile.type
  };

  jobSourceService.postItem(jobSourceItem, cbkCredUpload.bind(null, files, elemLoader, next));
};

module.exports = exports;
