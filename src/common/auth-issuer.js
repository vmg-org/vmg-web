/**
 * Auth issuer helper
 *     all of these buttons have one callback
 * @module
 */
var hbrs = require('../vmg-helpers/hbrs');
var ahr = require('../vmg-helpers/app');
var srv = require('../vmg-services/srv');

/**
 * Model: auth issuer
 *    base model for other providers
 * @constructor
 */
var Mdl = function(dto, root, zpath) {
  this.root = root;
  this.zpath = zpath;
  /**
   * Id of provider, like goog, fb, dev
   * @type {String}
   */
  this.id = dto.id;

  /**
   * Key for a font with icon
   * @type {String}
   */
  this.icon_key = dto.icon_key;

  /**
   * Id of application, registered in a provider
   * @type {String}
   */
  this.app_id = dto.app_id; //config.FB_CLIENT_ID;

  /**
   * Function name for start auth process
   *     send a button elem to diactivate it
   * @type {String}
   */
  this.fnc_start_auth = this.zpath + '.startAuth(this)';

  /**
   * Retrieved after login (if success)
   * @type {String}
   */
  this.social_token = null;

  /**
   * Auth library
   * @type {Object}
   */
  this.authLib = null;

  /** 
   * Whether the library is loaded
   * @type {Boolean}
   */
  this.isAuthLibLoaded = false;

  /**
   * Markup for ready button
   */
  this.markupAuthButton = hbrs.compile(this.root.markups.authButton);

  /**
   * Markup for pre-button (a library not loaded yet)
   */
  this.markupAuthPreButton = hbrs.compile(this.root.markups.authPreButton);

  /**
   * Text on a button
   * @type {String}
   */
  this.login_with = 'Logging with';
};


/**
 * Send a request to API to generate a new session
 */
Mdl.prototype.postLoginToApi = function() {
  srv.w2001({
    id_of_auth_issuer: this.id,
    social_token: this.social_token
  }, this.root.afterLogin.bind(this.root));
};

/**
 * Load a lib to OAuth
 * @abstract
 */
Mdl.prototype.loadAuthLib = function() {
  throw new Error('must be implemented by subclass!');

  /*
    } else if (this.id === 'goog') {
      // next flow - only after user action (auth)

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
 * After a library is loaded
 * @abstract
 */
Mdl.prototype.handleAuthLib = function() {
  throw new Error('must be implemented by subclass!');
};

/**
 * Build html for a button
 *     1- State of the button, ready for click
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
 * Activate a button: after a library is loaded
 *    usually once per page
 */
Mdl.prototype.activate = function() {
  this.isAuthLibLoaded = true;
  this.root.buildAuthButtons();
};

/**
 * Click the button to start OAuth process
 * @abstract
 */
Mdl.prototype.startAuth = function() {
  throw new Error('must be implemented by subclass!');
};

/**
 * Inherit properties
 */
exports.inhProps = function(cntx, arrArgs) {
  Mdl.apply(cntx, arrArgs);
};

/**
 * Inherit methods
 */
exports.inhMethods = function(cntx) {
  ahr.inherits(cntx, Mdl);
};

module.exports = exports;
