/** vmg-services/job-cut */
'use strict';

var demoSid = 'qwer'; // retrieve from cookie everytime
var rqst = require('../vmg-helpers/rqst');
var config = require('../config');
var apiUrl = config.API_ENDPOINT;

exports.getItem = function(id_of_media_spec, next) {
  var url = apiUrl + 'r1007?id_of_media_spec=' + id_of_media_spec + '&sid=' + demoSid;
  rqst.send('GET', url, {
    cache: false
  }, next);
};

exports.postItem = function(jobCut, next) {
  rqst.send('POST', apiUrl + 'w2005?sid=' + demoSid, {
    data: JSON.stringify(jobCut)
  }, next);
};

module.exports = exports;
