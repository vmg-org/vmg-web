/** @module */
'use strict';
var srv = require('../vmg-services/srv');
var dhr = require('../vmg-helpers/dom');

var devSignIn = function(next) {
  srv.w2001({
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
