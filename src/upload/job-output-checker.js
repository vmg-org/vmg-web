/** @module */
'use strict';
var demoSid = 'qwer';
var rqst = require('../vmg-helpers/rqst');
var config = require('../vmg-helpers/config');

var handleJobOutput = function(err, jobOutput) {
  if (err) {
    return alert(err.message);
  }

  console.log('jobOutput', jobOutput);
};

exports.run = function(jobOutput) {
  // set interval later
  //
  var url = config.API_ENDPOINT + 'r1006?id_of_media_spec=' + jobOutput.id_of_media_spec + '&sid=' + demoSid;
  rqst.send('GET', url, {}, handleJobOutput);
};

module.exports = exports;
