/**
 * Handle files from input field (or drag and drop)
 *     Retrieves signature and other fields from server
 *     and uploads a file to a cloud
 *     Returns status of upload
 * @module
 */
'use strict';

var jobSourceService = require('../vmg-services/job-source');

var handleProgress = function(evt) {
  var pr = parseInt((evt.loaded / evt.total) * 100);
  var uplPlayer = 'upl-player';
  $('.' + uplPlayer).html('Loading, % ' + pr + '<br>Loaded, KB: ' + parseInt(evt.loaded / 1024) +
    ' <br>Total, KB: ' + parseInt(evt.total / 1024));
};

var cbkFileUpload = function(jobSource, next, files, rejected) {
  console.log('send begin', jobSource, rejected);
  //  return;
  window.FileAPI.upload({
    url: jobSource.url_to_upload,
    data: JSON.parse(jobSource.url_to_read),
    files: {
      file: files[0]
    },
    cache: true, // remove query string from a request - it is required for S3
    complete: next.bind(null, jobSource),
    progress: handleProgress
  });
};

var cbkCredUpload = function(files, next, err, jobSource) {
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
  }, cbkFileUpload.bind(null, jobSource, next));
};

/**
 * Handle
 * @param {Object} evt - event from input selector or drag and drop
 */
exports.handleFileSelector = function(next, evt) {
  var files = window.FileAPI.getFiles(evt); // Retrieve file list
  var needFile = files[0];
  console.log(needFile);
  console.log('evt', evt);
  var demoIdOfMediaSpec = parseInt(window.location.hash.substr(1));

  var jobSourceItem = {
    id_of_media_spec: demoIdOfMediaSpec, //from hash
    id_of_container_format: needFile.type
  };

  jobSourceService.postItem(jobSourceItem, cbkCredUpload.bind(null, files, next));
};

module.exports = exports;
