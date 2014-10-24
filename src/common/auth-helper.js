/** @module */
'use strict';
var shr = require('../vmg-helpers/shr');
var config = require('../config');
var dhr = require('../vmg-helpers/dom');
var googHelper = require('./goog-helper');
var fbHelper = require('./fb-helper');
var userSessionService = require('../vmg-services/user-session');

var handleLogout = function() {
  // from cookie or context
  var sid = shr.getItem(config.AUTH_STORAGE_KEY);
  shr.removeItem(config.AUTH_STORAGE_KEY);
  userSessionService.deleteUserSession(sid, function() {
    // no callbask: if err - expired sessions will be removed automatically from db
  });
  window.location.reload();
};

var handleUserSession = function(next, err, userSession) {
  if (err) {
    alert(err.message);
    return;
  }

  // TODO: #33! handle if userSession is null (expired);
  this.userSession = userSession;

  console.log('mythis', this);

  shr.setItem(config.AUTH_STORAGE_KEY, userSession.id); // set again
  dhr.hideElems('.' + this.authCls.authNo);
  // hide auth no block // if visible
  // if r with error (sid not found) set visible block
  // apply display_name to the block
  //  console.log('asdfads', authNoBlockName, authProfileBlockName, err, r);
  dhr.impl(this.bem, this.authCls.authProfile, 'social_profile', [{
    display_name: userSession.social_profile_item.display_name
  }]);

  var btnLogout = dhr.getElem('.' + this.authCls.fncLogout);
  dhr.off(btnLogout, 'click');
  dhr.on(btnLogout, 'click', handleLogout);

  dhr.showElems('.' + this.authCls.authProfile);
  next();
};

exports.handleSid = function(next) {
  // this = ctx
  var cbk = handleUserSession.bind(this, next);

  if (!this.sid) {
    // next flow - only after user action (auth)
    window.googAsyncInit = googHelper.init.bind(this, cbk);
    dhr.loadGoogLib('googAsyncInit');

    window.fbAsyncInit = fbHelper.init.bind(this, cbk);
    dhr.loadFbLib(); // fbAsyncInit by default    
    // we can't send next functions to this handlers, that show buttons now

    dhr.showElems('.' + this.authCls.authNo);
  } else {
    console.log('we have sid', this.sid);
    // next flow - now
    // if sid is wrong or outdated - send a error? or null?
    // remove sid - show auth buttons
    userSessionService.getUserSession(this.sid, cbk);
  }
};

exports.buildCls = function(next) {
  this.authCls = {
    authNo: 'auth-no',
    authProfile: 'auth-profiles',
    fncGoog: 'auth-no__auth-button_social_goog',
    fncFb: 'auth-no__auth-button_social_fb',
    fncLogout: 'auth-profile__logout'
  };

  next();
};

exports.loadSid = function(next) {
  this.sid = shr.getItem(config.AUTH_STORAGE_KEY) || null;
  next();
};

module.exports = exports;
