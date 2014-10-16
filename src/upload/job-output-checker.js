/** @module */
'use strict';
var demoSid = 'qwer';
var rqst = require('../vmg-helpers/rqst');
var config = require('../vmg-helpers/config');

var handleJobOutput = function(next, err, jobOutput) {
  if (err) {
    return next(err);
  }

  if (jobOutput.id_of_job_status === 'Error') {
    return next(new Error('a job to create ouput files is failed'));
  }

  if (jobOutput.id_of_job_status === 'Complete') {
    console.log('jobOutputReady', jobOutput);
    return next(null, jobOutput.file_output_arr[0].media_file_item);
  }

  // retry again
  setTimeout(exports.run.bind(null, jobOutput, next), 1500);
};

exports.run = function(jobOutput, next) {
  // set interval later
  //
  var url = config.API_ENDPOINT + 'r1006?id_of_media_spec=' + jobOutput.id_of_media_spec + '&sid=' + demoSid;
  rqst.send('GET', url, {
    cache: false
  }, handleJobOutput.bind(null, next));
};

module.exports = exports;
