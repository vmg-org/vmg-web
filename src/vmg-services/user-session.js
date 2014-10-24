/** vmg-services/user-session */
'use strict';

var apiRqst = require('../vmg-helpers/api-rqst');

exports.postUserSession = function(id_of_auth_issuer, social_token, next) {
  apiRqst.sendPost('w2001', {}, {
    id_of_auth_issuer: id_of_auth_issuer,
    social_token: social_token
  }, next);
};

exports.getUserSession = function(sid, next) {
  apiRqst.sendGet('r1003', {
    sid: sid
  }, next);
};

exports.deleteUserSession = function(sid, next) {
  apiRqst.sendDelete('d4000', {
    sid: sid
  }, next);
  //  rqst.send('DELETE', apiUrl + 'd4000?sid=' + sid, {}, next);
};

module.exports = exports;
