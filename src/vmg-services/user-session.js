/** vmg-services/user-session */
'use strict';

var rqst = require('../vmg-helpers/rqst');

var config = require('../config');

var apiUrl = config.API_ENDPOINT;

exports.postUserSession = function(id_of_auth_issuer, social_token, next) {
  var opts = {
    data: JSON.stringify({
      id_of_auth_issuer: id_of_auth_issuer,
      social_token: social_token
    })
  };

  rqst.send('POST', apiUrl + 'w2001', opts, next);
};

exports.getUserSession = function(sid, next) {
  rqst.send('GET', apiUrl + 'r1003?sid=' + sid, {}, next);
};

exports.deleteUserSession = function(sid, next) {
  rqst.send('DELETE', apiUrl + 'd4000?sid=' + sid, {}, next);
};

module.exports = exports;
