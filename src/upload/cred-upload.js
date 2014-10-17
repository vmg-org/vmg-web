/** @module */
'use strict';

var rqst = require('../vmg-helpers/rqst');
var config = require('../vmg-helpers/config');
var demoSid = 'qwer';

exports.run = function(jobSource, next) {
  var opts = {};
  opts.data = JSON.stringify(jobSource);
  var url = config.API_ENDPOINT + 'w2003?sid=' + demoSid;
  rqst.send('POST', url, opts, next);
};

module.exports = exports;
