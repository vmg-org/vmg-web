/** @module */

var userSessionService = require('../vmg-services/user-session');
var shr = require('../vmg-helpers/shr');
var config = require('../config');

var Mdl = function() {
  /**
   * Whether cookie is exists
   */
  this.sid = null;
  // this.isServerAuth = null; // userSesion exists or not
  this.userSession = null;
  this.err = null;
};

Mdl.prototype.setUserSession = function(err, userSession) {
  if (err) {
    this.setErr(err);
  }

  this.userSession = userSession;
  this.onUserSession();
};

Mdl.prototype.loadUserSession = function() {
  userSessionService.getUserSession(this.sid, this.setUserSession.bind(this));
};

Mdl.prototype.loadSid = function() {
  this.sid = shr.getItem(config.AUTH_STORAGE_KEY) || null;
  console.log('sid loaded');
  this.onSid();
};

Mdl.prototype.setErr = function(err) {
  this.err = err;
  this.onErr();
};

exports.init = function() {
  var obj = Object.create(Mdl.prototype);
  Mdl.apply(obj, arguments);
  return obj;
};

module.exports = exports;
