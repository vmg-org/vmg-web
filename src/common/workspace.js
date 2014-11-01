/**
 * Base workspace for all pages
 * @module
 */
'use strict';
var commonCls = require('./cls');
var shr = require('../vmg-helpers/shr');
var config = require('../config');
var dhr = require('../vmg-helpers/dom');
var googHelper = require('./goog-helper');
var fbHelper = require('./fb-helper');
var devHelper = require('./dev-helper');
var srv = require('../vmg-services/srv');
//var lgr = require('../vmg-helpers/lgr');
var mdlUserSession = require('./user-session');
var pph = require('./popup-helper');

var Mdl = function(cls) {
  this.doc = window.document;
  $.extend(cls, commonCls);
  this.cls = cls;
  this.sid = null;
  this.userSession = null; // is authenticated
};

Mdl.prototype.loadSid = function(next) {
  this.sid = shr.getItem(config.AUTH_STORAGE_KEY) || null;
  next();
};

Mdl.prototype.handleUserSession = function(next, err, userSession) {
  if (err) {
    // if sid is wrong or outdated - receive an error: 401
    // remove sid - show auth buttons
    if (err.message === 'unauthorized') {
      // update a page
      //    alert('Your session is outdated: a page will be reloaded. Please login again');
      shr.removeItem(config.AUTH_STORAGE_KEY);
      window.location.reload();
      return;
    }

    alert(err.message);
    return;
  }

  // TODO: #33! handle if userSession is null (expired);
  console.log('usse', userSession);
  this.userSession = mdlUserSession.init(userSession, this);
  this.userSession.saveOnClient();
  next();
};

Mdl.prototype.showNoAuthWarning = function(next) {
  dhr.html('.' + this.cls.notif, 'Please log in');
  dhr.showElems('.' + this.cls.notif);
  next();
};

Mdl.prototype.waitUserLogin = function(nextFlow) {
  var cbk = this.handleUserSession.bind(this, nextFlow);
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

Mdl.prototype.handleSid = function(next) {
  // this = ctx
  if (!this.sid) {
    next(); //without a session
  } else {
    console.log('we have sid', this.sid);
    var cbk = this.handleUserSession.bind(this, next);
    // next flow - now
    // if sid is wrong or outdated - receive an error: 401
    // remove sid - show auth buttons
    srv.r1003(cbk);
  }
};

Mdl.prototype.addEvents = function(next) {
  var elemMenuCall = dhr.getElem('.' + this.cls.menuCall);
  dhr.on(elemMenuCall, 'click', pph.turnPopup.bind(null, this.cls.menuPopup));

  dhr.on(this.doc.body, 'keyup', pph.hidePopupByEscape.bind(null, this.cls.menuPopup));
  var elemMenuPopup = dhr.getElem('.' + this.cls.menuPopup);
  dhr.on(elemMenuPopup, 'click', pph.hidePopupIfOut.bind(null, this.cls.menuPopup));

  var elemClose = dhr.getElem('.' + this.cls.menuViewClose);
  dhr.on(elemClose, 'click', pph.turnPopup.bind(null, this.cls.menuPopup));

  var elemNotifWrapClose = dhr.getElem('.' + this.cls.notifWrapClose);
  dhr.on(elemNotifWrapClose, 'click', pph.turnPopup.bind(null, this.cls.notif));

  next();
};

module.exports = Mdl;
