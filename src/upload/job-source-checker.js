/** @module */
'use strict';

var demoSid = 'qwer';
var rqst = require('../vmg-helpers/rqst');
var config = require('../vmg-helpers/config');
var jobOutputChecker = require('./job-output-checker');

var handleJobOutput = function(err, jobOutput) {
  if (err) {
    alert(err.message);
    return;
  }

  jobOutputChecker.run(jobOutput);

  console.log('jobOutput', jobOutput);
};

var createJobOutput = function(jobSource) {
  var jobOutput = {
    id_of_media_spec: jobSource.id_of_media_spec
      // null
  };
  var opts = {
    data: JSON.stringify(jobOutput)
  };
  rqst.send('POST', config.API_ENDPOINT + 'w2004?sid=' + demoSid, opts,
    handleJobOutput);
};

var handleJobSource = function(err, jobSource) {
  if (err) {
    alert(err.message);
    return console.log(err);
  }

  console.log(jobSource);

  if (!jobSource.file_source_item) {
    alert('no file source yet: not uploaded');
    return;
  }

  // create a job_output
  createJobOutput(jobSource);
};

exports.run = function(jobSource) {
  var url = config.API_ENDPOINT + 'r1005?id_of_media_spec=' + jobSource.id_of_media_spec + '&sid=' + demoSid;
  rqst.send('GET', url, {}, handleJobSource);
};

module.exports = exports;
