/** vmg-services/job-output */
'use strict';

var demoSid = 'qwer'; // retrieve from cookie everytime
var rqst = require('../vmg-helpers/rqst');
var config = require('../config');
var apiUrl = config.API_ENDPOINT;

exports.getItem = function(id_of_media_spec, next) {
  var url = apiUrl + 'r1006?id_of_media_spec=' + id_of_media_spec + '&sid=' + demoSid;
  rqst.send('GET', url, {
    cache: false
  }, next);
};

exports.postItem = function(jobOutput, next) {
  var opts = {
    data: JSON.stringify(jobOutput)
  };

  rqst.send('POST', apiUrl + 'w2004?sid=' + demoSid, opts, next);
};

module.exports = exports;
