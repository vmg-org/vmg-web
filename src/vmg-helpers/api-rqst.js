/**
 * Send requests to API endpoint
 *     with session id, from cookie of local storage
 * @module
 */
'use strict';

var rqst = require('../vmg-helpers/rqst');
var config = require('../config');
var apiUrl = config.API_ENDPOINT;

exports.sendGet = function(path, queryObj, next) {
  var queryString = $.param(queryObj);
  if (queryString) {
    path = path + '?' + queryString;
  }
  // TODO: #33! add sid if exists
  rqst.send('GET', apiUrl + path, {}, next);
};

exports.sendPost = function(path, queryObj, bodyObj, next) {
  var queryString = $.param(queryObj);
  if (queryString) {
    path = path + '?' + queryString;
  }

  rqst.send('POST', apiUrl + path, {
    data: JSON.stringify(bodyObj)
  }, next);
};

exports.sendDelete = function(path, queryObj, next) {
  var queryString = $.param(queryObj);
  if (queryString) {
    path = path + '?' + queryString;
  }

  rqst.send('DELETE', apiUrl + path, {}, next);
};

module.exports = exports;
