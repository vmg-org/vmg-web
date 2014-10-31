/** @module */
'use strict';
var srv = require('../vmg-services/srv');
var dhr = require('../vmg-helpers/dom');
var ahr = require('../vmg-helpers/app');

var devSignIn = function(next) {
  var userNumber = window.prompt('User # (from 1 to 9):');
  if (!userNumber) {
    alert('required: user #');
    return;
  }

  userNumber = ahr.toInt(userNumber);
  if (userNumber >= 1 && userNumber <= 9) {
    srv.w2001({
      id_of_auth_issuer: 'dev',
      social_token: 'snid' + userNumber
    }, next);
  }
};

exports.init = function(next) {
  var btn = dhr.getElem('.' + this.cls.fncDev);
  dhr.off(btn, 'click');
  dhr.on(btn, 'click', devSignIn.bind(this, next));
  dhr.showElems(btn);
  console.log('dev is loaded');
};

module.exports = exports;
