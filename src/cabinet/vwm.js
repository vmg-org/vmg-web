/** @module */

//var movieRecordService = require('../vmg-services/movie-record');
//var dhr = require('../vmg-helpers/dom');
//var lgr = require('../vmg-helpers/lgr');
//var srv = require('../vmg-services/srv');
//var ahr = require('../vmg-helpers/app');

exports.waitDocReady = function(next) {
  $(this.doc).ready(next);
};

module.exports = exports;
