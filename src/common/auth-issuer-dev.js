/** @module */
'use strict';
var dhr = require('../vmg-helpers/dom');
var ahr = require('../vmg-helpers/app');
var mdlAuthIssuer = require('./auth-issuer');

/**
 * Dev auth issuer
 * @constructor
 * @augments module:common/auth-issuer~Mdl
 */
var Mdl = function() {
  mdlAuthIssuer.inhProps(this, arguments);
};

mdlAuthIssuer.inhMethods(Mdl);

/**
 * Start dev auth
 */
Mdl.prototype.startAuth = function(elem) {
  dhr.disable(elem);
  var userNumber = window.prompt('User # (from 1 to 9):');
  if (!userNumber) {
    alert('required: user #');
    return;
  }

  userNumber = ahr.toInt(userNumber);
  if (userNumber >= 1 && userNumber <= 9) {
    this.social_token = 'snid' + userNumber;  
    this.postLoginToApi();
  }
};

/**
 * Handle dev lib
 */
Mdl.prototype.handleAuthLib = function(){
  this.authLib = {};
  this.activate();
};

/**
 * Load dev lib
 */
Mdl.prototype.loadAuthLib = function(){
  // imitation
  this.handleAuthLib();
};

/**
 * Create an object
 */
exports.init = function() {
  var obj = Object.create(Mdl.prototype);
  Mdl.apply(obj, arguments);
  return obj;
};

module.exports = exports;
