/** vmg-services/user-session */
'use strict';

var apiRqst = require('../vmg-helpers/api-rqst');

exports.postUserSession = function(dto, next) {
  apiRqst.sendPostPublic('w2001', {}, dto, next);
};

exports.getUserSession = function(next) {
  // secured method - do not send this method withoud SID in localStorage
  apiRqst.sendGet('r1003', {}, next);
};

exports.deleteUserSession = function(next) {
  apiRqst.sendDelete('d4000', {}, next);
};

module.exports = exports;
