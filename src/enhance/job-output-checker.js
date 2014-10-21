/** @module */
'use strict';

var jobOutputService = require('../vmg-services/job-output');
var ahr = require('../vmg-helpers/app');

var handleGetJobOutput = function(next, err, jobOutput) {
  if (err) {
    return next(err);
  }

  // Job for conversion is not created
  if (!jobOutput) {
    // User can't stay on this page, without a output_job
    window.location.replace('./error.html?msg=output-job-is-not-exists');
    return;
  }

  if (jobOutput.id_of_job_status === 'Error') {
    // TODO: #34! handle job output if error (re-create try)
    //    var statusDetail = jobOutput.status_detail;

    return next(new Error('A conversion job is failed. Retry with other file.'));
  }

  if (jobOutput.id_of_job_status === 'Complete') {
    console.log('jobOutputReady', jobOutput);
    return next(null, jobOutput);
  }

  // retry again
  setTimeout(exports.run.bind(null, jobOutput.id_of_media_spec, next), 1500);
};

exports.run = function(idOfMediaSpec, next) {
  console.log('idOfMediaSpec from asdf', idOfMediaSpec);

  idOfMediaSpec = ahr.toInt(idOfMediaSpec);

  if (!idOfMediaSpec) {
    return next(new Error('required: idOfMediaSpec as integer'));
  }

  jobOutputService.getItem(idOfMediaSpec, handleGetJobOutput.bind(null, next));
};

module.exports = exports;
