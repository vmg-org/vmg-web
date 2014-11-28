/**
 * Base workspace for all pages
 * @module
 */
'use strict';
var commonCls = require('./cls');
var commonMarkups = require('./markups');
var shr = require('../vmg-helpers/shr');
var config = require('../config');
var dhr = require('../vmg-helpers/dom');
var googHelper = require('./goog-helper');
var fbHelper = require('./fb-mdl');
var devHelper = require('./dev-helper');
var srv = require('../vmg-services/srv');
//var lgr = require('../vmg-helpers/lgr');
var mdlUserSession = require('./user-session');
var pph = require('./popup-helper');
var lgr = require('../vmg-helpers/lgr');
var hbrs = require('../vmg-helpers/hbrs');
var mdlAuthIssuer = require('./auth-issuer');

var Mdl = function(cls, markups, zpath) {
  this.doc = window.document;
  this.zpath = zpath;
  $.extend(cls, commonCls);
  this.cls = cls;

  $.extend(markups, commonMarkups);
  this.markups = markups;

  this.sid = null;
  this.userSession = null; // is authenticated

  this.markupAuthNo = hbrs.compile(this.markups.authNo);
  this.markupAuthPopup = hbrs.compile(this.markups.authPopup);
  this.fnc_open_login_popup = this.zpath + '.openLoginPopup()';
  this.fnc_close_auth_popup = this.zpath + '.closeAuthPopup()';
  this.fnc_close_auth_popup_out = this.zpath + '.closeAuthPopupOut(this, event)';
  this.isAuthPopupLoaded = false;

  this.authIssuers = null;
  this.loadAuthIssuers();
  console.log(this.authIssuers);
};

Mdl.prototype.initAuthIssuer = function(item){
  return mdlAuthIssuer.init(item, this);
};

Mdl.prototype.loadAuthIssuers = function() {
  var issData = [{
    id: 'goog'
  }, {
    id: 'fb'
  }, {
    id: 'dev'
  }];

  this.authIssuers = issData.map(this.initAuthIssuer.bind(this));
};

Mdl.prototype.loadSid = function(next) {
  this.sid = shr.getItem(config.AUTH_STORAGE_KEY) || null;
  next();
};

Mdl.prototype.openLoginPopup = function() {
  if (this.isAuthPopupLoaded) {
    dhr.showElems('.' + this.cls.authPopup);
    return;
  }
  this.isAuthPopupLoaded = true;
  var cbk = this.handleUserSession.bind(this, function() {
    window.location.reload();
  });
  // next flow - only after user action (auth)
  window.googAsyncInit = googHelper.init.bind(this, cbk);
  dhr.loadGoogLib('googAsyncInit');

  var mdlFb = fbHelper.init(this, config.FB_CLIENT_ID);
  window.fbAsyncInit = mdlFb.initLib.bind(mdlFb, cbk);
  dhr.loadFbLib(); // fbAsyncInit by default    
  // we can't send next functions to this handlers, that show buttons now

  // apply context
  devHelper.init.apply(this, [cbk]);

  var htmlAuthPopup = this.markupAuthPopup(this);
  dhr.html('.' + this.cls.popupScope, htmlAuthPopup);

  //  dhr.showElems('.' + this.cls.authPopup);
  console.log('popup opened');

  var htmlButtons = 'superhtml'; // TODO: #33! generate buttons
  dhr.html('.' + this.cls.authButtons, htmlButtons);
};

Mdl.prototype.closeAuthPopup = function() {
  dhr.hideElems('.' + this.cls.authPopup);
};

Mdl.prototype.closeAuthPopupOut = function(elem, e) {
  if (e.currentTarget === e.target) { //.parentElement) {
    $(elem).hide();
  }
};

Mdl.prototype.waitDocReady = function(next) {
  $(this.doc).ready(next);
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

Mdl.prototype.waitUserLogin = function() {

  // get auth-no template
  // add params if need
  // add to auth-scope

  var htmlAuthNo = this.markupAuthNo(this);
  var elemAuthScope = dhr.getElem('.' + this.cls.authScope);
  dhr.html(elemAuthScope, htmlAuthNo);
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
  dhr.on(this.doc.body, 'keyup', pph.hidePopupByEscape.bind(null, this.cls.authPopup));
  var elemMenuPopup = dhr.getElem('.' + this.cls.menuPopup);
  dhr.on(elemMenuPopup, 'click', pph.hidePopupIfOut.bind(null, this.cls.menuPopup));

  var elemClose = dhr.getElem('.' + this.cls.menuViewClose);
  dhr.on(elemClose, 'click', pph.turnPopup.bind(null, this.cls.menuPopup));

  var elemNotifWrapClose = dhr.getElem('.' + this.cls.notifWrapClose);
  dhr.on(elemNotifWrapClose, 'click', pph.turnPopup.bind(null, this.cls.notif));

  next();
};

// last in a flow
Mdl.prototype.last = function() {
  console.log('last func');
};

Mdl.prototype.handleError = function(err) {
  dhr.html('.' + this.cls.notif, err.message || '%=serverError=%');
  dhr.showElems('.' + this.cls.notif);
  lgr.error(err);
};

Mdl.prototype.reloadPage = function() {
  this.doc.location.reload();
};

Mdl.prototype.rdr = function(urlToRdr) {
  this.doc.location.href = urlToRdr;
};

module.exports = Mdl;
