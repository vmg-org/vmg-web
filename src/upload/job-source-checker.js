/** @module */
'use strict';

var demoSid = 'qwer';
var rqst = require('../vmg-helpers/rqst');
var config = require('../vmg-helpers/config');
var jobOutputChecker = require('./job-output-checker');

var handleJobOutput = function(next, err, jobOutput) {
  if (err) {
    return next(err);
  }

  jobOutputChecker.run(jobOutput, next);

  console.log('jobOutput', jobOutput);
};

var createJobOutput = function(jobSource, next) {
  var jobOutput = {
    id_of_media_spec: jobSource.id_of_media_spec
  };
  var opts = {
    data: JSON.stringify(jobOutput)
  };
  rqst.send('POST', config.API_ENDPOINT + 'w2004?sid=' + demoSid, opts,
    handleJobOutput.bind(null, next));
};

var handleJobSource = function(next, err, jobSource) {
  if (err) {
    return next(err);
  }

  console.log(jobSource);

  if (!jobSource.file_source_item) {
    return next(new Error('source file is not uploaded yet'));
  }

  // create a job_output
  createJobOutput(jobSource, next);
};

exports.run = function(jobSource, next) {
  var url = config.API_ENDPOINT + 'r1005?id_of_media_spec=' + jobSource.id_of_media_spec + '&sid=' + demoSid;
  // TODO: #43! err from rqst - as Error instead res.err
  rqst.send('GET', url, {
    cache: false
  }, handleJobSource.bind(null, next));
};

module.exports = exports;
