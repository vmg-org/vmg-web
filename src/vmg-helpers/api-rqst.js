/**
 * Send requests to API endpoint
 *     with session id, from cookie of local storage
 * @module
 */
'use strict';

var rqst = require('../vmg-helpers/rqst');
var config = require('../config');
var apiUrl = config.API_ENDPOINT;
var shr = require('../vmg-helpers/shr');

exports.sendGet = function(path, queryObj, next) {
  var sid = shr.getItem(config.AUTH_STORAGE_KEY);
  // only GET requests may be public
  if (!sid) {
    // error
    next(new Error('required: auth'));
    return;
  }

  var opts = {};
  opts.headers = {
    authorization: 'BEARER ' + sid
  };
  var queryString = $.param(queryObj);
  if (queryString) {
    path = path + '?' + queryString;
  }
  rqst.send('GET', apiUrl + path, opts, next);
};

exports.sendGetPublic = function(path, queryObj, next) {
  var queryString = $.param(queryObj);
  if (queryString) {
    path = path + '?' + queryString;
  }
  rqst.send('GET', apiUrl + path, {}, next);
};

exports.sendPost = function(path, queryObj, bodyObj, next) {
  var sid = shr.getItem(config.AUTH_STORAGE_KEY);
  // only GET requests may be public
  if (!sid) {
    // error
    next(new Error('required: auth'));
    return;
  }
  var opts = {};
  opts.headers = {
    authorization: 'BEARER ' + sid
  };
  var queryString = $.param(queryObj);
  if (queryString) {
    path = path + '?' + queryString;
  }

  opts.data = JSON.stringify(bodyObj);

  rqst.send('POST', apiUrl + path, opts, next);
};

// For methods, like Post User session
exports.sendPostPublic = function(path, queryObj, bodyObj, next) {
  var queryString = $.param(queryObj);
  if (queryString) {
    path = path + '?' + queryString;
  }

  rqst.send('POST', apiUrl + path, {
    data: JSON.stringify(bodyObj)
  }, next);
};

exports.sendDelete = function(path, queryObj, next) {
  var sid = shr.getItem(config.AUTH_STORAGE_KEY);
  // only GET requests may be public
  if (!sid) {
    // error
    next(new Error('required: auth'));
    return;
  }
  var opts = {};
  opts.headers = {
    authorization: 'BEARER ' + sid
  };
  var queryString = $.param(queryObj);
  if (queryString) {
    path = path + '?' + queryString;
  }

  rqst.send('DELETE', apiUrl + path, opts, next);
};

module.exports = exports;
