/**
 * Init model with auth issuer
 *     all of these buttons have one callback: handlePostUserSession from root
 */
var hbrs = require('../vmg-helpers/hbrs');
//var googHelper = require('./goog-helper');
//var devHelper = require('./dev-helper');
//var dhr = require('../vmg-helpers/dom');
var ahr = require('../vmg-helpers/app');
var srv = require('../vmg-services/srv');

var Mdl = function(dto, root, zpath) {
  this.root = root;
  this.zpath = zpath;
  this.id = dto.id;
  this.icon_key = dto.icon_key;
  this.app_id = dto.app_id; //config.FB_CLIENT_ID;
  this.fnc_start_auth = this.zpath + '.startAuth()';

  /**
   * Retrieved after login (if success)
   * @type {String}
   */
  this.social_token = null;
  this.authLib = null;
  this.isAuthLibLoaded = false;
  this.markupAuthButton = hbrs.compile(this.root.markups.authButton);
  this.markupAuthPreButton = hbrs.compile(this.root.markups.authPreButton);

  this.login_with = 'Logging with';

  // defined in descendants
  //this.icon_key;
};

/*  switch (this.id) {
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
*/

Mdl.prototype.postLoginToApi = function() {
  srv.w2001({
    id_of_auth_issuer: 'fb',
    social_token: this.social_token
  }, this.root.afterLogin.bind(this.root));
};

/**
 * Load a lib to OAuth
 */
Mdl.prototype.loadAuthLib = function() {
  throw new Error('required override loadAuthLib');
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

/** 
 * Abstract method
 */
Mdl.prototype.loadAuthLib = function() {
  throw new Error('required ovveride');
  /*
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
  */
};

/**
 * Usually only once per page
 */
Mdl.prototype.activate = function() {
  this.isAuthLibLoaded = true;
  this.root.buildAuthButtons();
};

/**
 * Click the button to start OAuth process
 */
Mdl.prototype.startAuth = function() {
  throw new Error('required override startAuth');
};

exports.inhProps = function(cntx, arrArgs) {
  Mdl.apply(cntx, arrArgs);
  //  ahr.inherits(cntx, Mdl);
};

exports.inhMethods = function(cntx) {
  ahr.inherits(cntx, Mdl);
};

module.exports = exports;
