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
var srv = require('../vmg-services/srv');
//var lgr = require('../vmg-helpers/lgr');
var mdlUserSession = require('./user-session');
var pph = require('./popup-helper');
var lgr = require('../vmg-helpers/lgr');
var hbrs = require('../vmg-helpers/hbrs');
var mdlFbIssuer = require('./auth-issuer-fb');
var mdlGoogIssuer = require('./auth-issuer-goog');
var mdlDevIssuer = require('./auth-issuer-dev');
//var mdlAppMenu = require('./app-menu');
var mdlPopWin = require('./pop-win');
//var mdlAuthSet = require('./auth-set');

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

  this.authPopWin = mdlPopWin.init(this.markups.authPopup, this.cls.popupScope, this.zpath + '.authPopWin');
  this.fnc_show_login_choice = this.zpath + '.showLoginChoice()';

  this.menuPopWin = mdlPopWin.init(this.markups.menuPopup, this.cls.popupScope, this.zpath + '.menuPopWin');
  this.fnc_show_menu_choice = this.zpath + '.showMenuChoice()';

  //  this.authSet = mdlAuthSet.init({
  //    handleAuthResult: this.fncPostLoginToApi
  //  });

  this.authIssuers = null;
  this.loadAuthIssuers();
};

/**
 * Callback from auth-issuer model
 *   to send login data
 */
Mdl.prototype.fncPostLoginToApi = function(id_of_auth_issuer, social_token) {
  srv.w2001({
    id_of_auth_issuer: id_of_auth_issuer,
    social_token: social_token
  }, this.afterLogin.bind(this));
};

Mdl.prototype.initAuthIssuer = function(item, ind) {
  var mdlIssuer;
  if (item.id === 'fb') {
    mdlIssuer = mdlFbIssuer;
  } else if (item.id === 'goog') {
    mdlIssuer = mdlGoogIssuer;
  } else if (item.id === 'dev') {
    mdlIssuer = mdlDevIssuer;
  } else {
    // nothing
    throw new Error('nosuchissuer');
  }
  var obj = mdlIssuer.init(item,
    this.zpath + '.authIssuers[' + ind + ']',
    this.fncPostLoginToApi.bind(this),
    this.buildAuthButtons.bind(this),
    this.markups.authButton,
    this.markups.authPreButton);
  return obj;
};

Mdl.prototype.afterLogin = function(err, userSession) {
  this.handleUserSession(function() {
    window.location.reload();
  }, err, userSession);
  /*  var cbkAfterLogin = this.handleUserSession.bind(this, function() {
      window.location.reload();
    });

    cbkAfterLogin();*/
};

Mdl.prototype.loadAuthIssuers = function() {

  var issData = [{
    id: 'fb',
    app_id: config.FB_CLIENT_ID,
    icon_key: 'b'
  }, {
    id: 'goog',
    app_id: config.GOOG_CLIENT_ID,
    icon_key: 'c'
  }, {
    id: 'dev',
    app_id: '',
    icon_key: 'i'
  }];

  this.authIssuers = issData.map(this.initAuthIssuer.bind(this));
};

Mdl.prototype.loadSid = function(next) {
  this.sid = shr.getItem(config.AUTH_STORAGE_KEY) || null;
  next();
};

Mdl.prototype.showMenuChoice = function() {
  // in current realization need open a popup window
  // in other realization - menu might be in a side-bar
  this.menuPopWin.showPopup();
  // load items to the popup (like in login popup)
};

/**
 * Show login choice
 *    now - in a popup window (open a popup with this action)
 */
Mdl.prototype.showLoginChoice = function() {
  this.authPopWin.showPopup();
  // start load libs for buttons
  // load only once per page: isLoadStarted
  this.authIssuers.forEach(function(issItem) {
    if (!issItem.isLoadStarted) {
      issItem.isLoadStarted = true;
      issItem.loadAuthLib();
    }
  });

  // draw pre or ready buttons
  this.buildAuthButtons();
};

Mdl.prototype.buildAuthButtons = function() {
  var htmlButtons = this.authIssuers.map(function(issItem) {
    return issItem.buildHtml();
  }).join('');

  // authButtons places in auth-popup window
  // but can be moved as separate module on the page
  dhr.html('.' + this.cls.authButtons, htmlButtons);
};

Mdl.prototype.waitDocReady = function(next) {
  $(this.doc).ready(next);
};

/**
 * After checking SID (r1003) or after POST login (w200x)
 *     after checking SID - no needed to save again in userSession
 *     after POST login - save a session and reload (redirect from a main site's page to a main user's page)
 */
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
  this.userSession = mdlUserSession.init(userSession, this, this.zpath + '.userSession');
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
  // TODO: #53! for index page - an auth-no block replaced by other block
  var htmlAuthNo = this.markupAuthNo(this);
  var elemAuthNoWrap = dhr.getElem('.' + this.cls.authNoWrap);
  dhr.html(elemAuthNoWrap, htmlAuthNo);
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

/**
 * Hide all popups, when user press an Escape key
 */
Mdl.prototype.hidePopupsByEscape = function(e) {
  if (e.keyCode === 27) {
    this.authPopWin.hidePopup();
    this.menuPopWin.hidePopup();
  }
};

/**
 * Add events for global elements, like body
 */
Mdl.prototype.addEvents = function(next) {
  dhr.on(this.doc.body, 'keyup', this.hidePopupsByEscape.bind(this));

  var elemNotifWrapClose = dhr.getElem('.' + this.cls.notifWrapClose);

  // TODO: #43! change to normal behavior like popups
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
