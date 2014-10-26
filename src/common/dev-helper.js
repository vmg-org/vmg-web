/** @module */
'use strict';
var userSessionService = require('../vmg-services/user-session');

var dhr = require('../vmg-helpers/dom');

var devSignIn = function(next) {
  userSessionService.postUserSession({
    id_of_auth_issuer: 'dev',
    social_token: 'dev_token'
  }, next);
};

exports.init = function(next) {
  var btn = dhr.getElem('.' + this.cls.fncDev);
  dhr.off(btn, 'click');
  dhr.on(btn, 'click', devSignIn.bind(this, next));
  dhr.showElems(btn);
  console.log('dev is loaded');
};

module.exports = exports;
