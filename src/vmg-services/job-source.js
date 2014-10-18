/** vmg-services/job-source */
'use strict';

var demoSid = 'qwer'; // retrieve from cookie everytime
var rqst = require('../vmg-helpers/rqst');
var config = require('../vmg-helpers/config');
var apiUrl = config.API_ENDPOINT;

exports.getItem = function(id_of_media_spec, next) {
  var url = apiUrl + 'r1005?id_of_media_spec=' + id_of_media_spec + '&sid=' + demoSid;

  rqst.send('GET', url, {
    cache: false
  }, next);
};

exports.postItem = function(jobSource, next) {
  var opts = {};
  opts.data = JSON.stringify(jobSource);
  var url = apiUrl + 'w2003?sid=' + demoSid;
  rqst.send('POST', url, opts, next);
};

module.exports = exports;
