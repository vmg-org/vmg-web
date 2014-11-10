/** @module */
'use strict';

var srv = require('../vmg-services/srv');

// A job for conversion is created
var handleJobOutput = function(next, err, jobOutput) {
  if (err) {
    return next(err);
  }

  // conversion started (it is about 10 second for 2MB
  // go to /enhance page to show and enhance a converted video
  // check in other page
  next(null, jobOutput);
};

var createJobOutput = function(jobSource, next) {
  var jobOutput = {
    id_of_media_spec: jobSource.id_of_media_spec
  };

  srv.w2004(jobOutput, handleJobOutput.bind(null, next));
};

var handleJobSource = function(next, err, jobSource) {
  if (err) {
    return next(err);
  }

  console.log(jobSource);
  // File_source created automatically if a file is uploaded successfuly
  if (!jobSource.file_source_item) {
    return next(new Error('source file is not uploaded yet'));
  }

  // create a job_output for conversion
  createJobOutput(jobSource, next);
};

// When the upload is done, client send a request to GET (update) a job_source
//     whether the file uploaded successfuly
exports.run = function(jobSource, next) {
  srv.r1005(jobSource.id_of_media_spec, handleJobSource.bind(null, next));
};

module.exports = exports;
