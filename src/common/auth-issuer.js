/**
 * Init model with auth issuer
 *     all of these buttons have one callback: handlePostUserSession from root
 */
var hbrs = require('../vmg-helpers/hbrs');
var fbHelper = require('./fb-mdl');
var googHelper = require('./goog-helper');
var devHelper = require('./dev-helper');
var config = require('../config');
var dhr = require('../vmg-helpers/dom');

var Mdl = function(dto, root, zpath) {
  this.root = root;
  this.zpath = zpath;
  this.id = dto.id;

  this.fnc_start_auth = this.zpath + '.startAuth()';

  //  this.cbkLogin = this.root.handleUserSession;

  this.isAuthLibLoaded = false;
  this.markupAuthButton = hbrs.compile(this.root.markups.authButton);
  this.markupAuthPreButton = hbrs.compile(this.root.markups.authPreButton);
  this.calcProps();
};

Mdl.prototype.calcProps = function() {
  switch (this.id) {
    case 'goog':
      this.icon_key = 'c';
      break;
    case 'fb':
      this.icon_key = 'b';
      break;
    case 'dev':
      this.icon_key = 'i';
      break;
  }

  this.login_with = 'Logging with'; // plus name of provider, if needed (or icons not loaded)
};

/**
 * 1- State of the button, ready for click
 *     2 - State of the button, when auth lib not loaded yet
 *     does not contains onclick property
 */
Mdl.prototype.buildHtml = function() {
  if (this.isAuthLibLoaded) {
    return this.markupAuthButton(this);
  } else {
    return this.markupAuthPreButton(this);
  }
};

Mdl.prototype.loadAuthLib = function(cbk) {
  console.log('loadAuthLib', this.id);
  if (this.id === 'fb') {
    var mdlFb = fbHelper.init(this, config.FB_CLIENT_ID);
    window.fbAsyncInit = mdlFb.initLib.bind(mdlFb, cbk);
    dhr.loadFbLib(); // fbAsyncInit by default    
  } else if (this.id === 'goog') {
    // next flow - only after user action (auth)
    window.googAsyncInit = googHelper.init.bind(this.root, cbk);
    dhr.loadGoogLib('googAsyncInit');
  } else if (this.id === 'dev') {
    // we can't send next functions to this handlers, that show buttons now

    // apply context
    devHelper.init.apply(this.root, [cbk]);
  } else {
    throw new Error('no such auth issuer');
  }
};

Mdl.prototype.activate = function(cbkStartAuth) {
  this.startAuth = cbkStartAuth;
  this.isAuthLibLoaded = true;
  this.root.buildAuthButtons();
};

Mdl.prototype.startAuth = function() {
  // redefined 
  //  console.log(this.id);
};

exports.init = function(dto, root, zpath) {
  return new Mdl(dto, root, zpath);
};

module.exports = exports;
