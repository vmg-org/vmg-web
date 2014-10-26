/** @module */
'use strict';
var shr = require('../vmg-helpers/shr');
var config = require('../config');
var dhr = require('../vmg-helpers/dom');
var googHelper = require('./goog-helper');
var fbHelper = require('./fb-helper');
var devHelper = require('./dev-helper');
var userSessionService = require('../vmg-services/user-session');
var lgr = require('../vmg-helpers/lgr');

var handleLogout = function() {
  // from cookie or context
  userSessionService.deleteUserSession(function(errDel) {
    // if sid is wrong - skip this error
    lgr.error(errDel);
    // no callbask: if err - expired sessions will be removed automatically from db
    shr.removeItem(config.AUTH_STORAGE_KEY);
    window.location.reload();
  });
};

var handleUserSession = function(next, err, userSession) {
  if (err) {
    // if sid is wrong or outdated - receive an error: 401
    // remove sid - show auth buttons
    if (err.message === 'unauthorized') {
      // update a page
      alert('Your session is outdated: a page will be reloaded. Please login again');
      handleLogout();
      return;
    }

    alert(err.message);
    return;
  }

  // TODO: #33! handle if userSession is null (expired);
  this.userSession = userSession;
  shr.setItem(config.AUTH_STORAGE_KEY, userSession.id); // set again
  next();
};

exports.showAuth = function(next) {
  dhr.hideElems('.' + this.cls.authNo);
  dhr.hideElems('.' + this.cls.notif);
  // hide auth no block // if visible
  // if r with error (sid not found) set visible block
  // apply display_name to the block
  //  console.log('asdfads', authNoBlockName, authProfileBlockName, err, r);
  console.log('userSession: ', this.userSession);
  dhr.impl(this.bem, this.cls.authProfile, 'social_profile', [{
    display_name: this.userSession.social_profile_item.display_name
  }]);

  var btnLogout = dhr.getElem('.' + this.cls.fncLogout);
  dhr.off(btnLogout, 'click');
  dhr.on(btnLogout, 'click', handleLogout);

  dhr.showElems('.' + this.cls.authProfile);
  next();
};

exports.showNoAuthWarning = function(next) {
  dhr.html('.' + this.cls.notif, 'Please log in');
  dhr.showElems('.' + this.cls.notif);
  next();
};

exports.waitUserLogin = function(nextFlow) {
  var cbk = handleUserSession.bind(this, nextFlow);
  // next flow - only after user action (auth)
  window.googAsyncInit = googHelper.init.bind(this, cbk);
  dhr.loadGoogLib('googAsyncInit');

  window.fbAsyncInit = fbHelper.init.bind(this, cbk);
  dhr.loadFbLib(); // fbAsyncInit by default    
  // we can't send next functions to this handlers, that show buttons now

  // apply context
  devHelper.init.apply(this, [cbk]);

  dhr.showElems('.' + this.cls.authNo);
};

exports.handleSid = function(next) {
  // this = ctx
  if (!this.sid) {
    next(); //without a session
  } else {
    console.log('we have sid', this.sid);
    var cbk = handleUserSession.bind(this, next);
    // next flow - now
    // if sid is wrong or outdated - receive an error: 401
    // remove sid - show auth buttons
    userSessionService.getUserSession(cbk);
  }
};

exports.loadSid = function(next) {
  this.sid = shr.getItem(config.AUTH_STORAGE_KEY) || null;
  next();
};

module.exports = exports;
