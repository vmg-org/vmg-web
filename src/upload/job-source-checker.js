/** @module */
'use strict';

var demoSid = 'qwer';
var rqst = require('../vmg-helpers/rqst');
var config = require('../vmg-helpers/config');

var handleJobSource = function(err, jobSource) {
  if (err) {
    alert(err.message);
    return console.log(err);
  }

  console.log(jobSource);

  if (jobSource.file_source_item) {
    alert('success');
  } else {
    alert('no file source yet: not uploaded');
  }
};

exports.run = function(jobSource) {
  var url = config.API_ENDPOINT + 'r1005?id_of_media_spec=' + jobSource.id_of_media_spec + '&sid=' + demoSid;
  rqst.send('GET', url, {}, handleJobSource);
};

module.exports = exports;
