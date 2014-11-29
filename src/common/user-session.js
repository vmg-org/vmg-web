/** @module */
'use strict';
var shr = require('../vmg-helpers/shr');
var config = require('../config');
var dhr = require('../vmg-helpers/dom');
var srv = require('../vmg-services/srv');
var lgr = require('../vmg-helpers/lgr');
var hbrs = require('../vmg-helpers/hbrs');

var mapKeys = function(data, prop) {
  this[prop] = data[prop];
};

/**
 * User session
 * @constructor
 */
var Mdl = function(data, root, zpath) {
  this.root = root;
  this.zpath = zpath;
  Object.keys(data).forEach(mapKeys.bind(this, data));

  /**
   * Name of an user, retrieved from socialProfile
   * @type {String}
   */
  this.display_name = data.social_profile_item.display_name;

  /**
   * Markup for auth user
   * @type {Object}
   */
  this.markupAuthYes = hbrs.compile(this.root.markups.authYes);

  /**
   * Path to a logout function
   * @type {String}
   */
  this.fnc_logout = this.zpath + '.logout()';

  /**
   * Label: logout
   * @type {String}
   */
  this.lbl_logout = 'Log out';

  /**
   * Redirect to this link, when click by display name
   * @type {String}
   */
  this.link_cabinet = './cabinet.html';

  /**
   * Redirect to an editor to create a new template
   * @type {String}
   */
  this.link_create_template = './template-editor.html';

  /**
   * Label: create a template
   * @type {String}
   */
  this.lbl_create_template = 'Create a template';
};

/**
 * Save a session in local storage
 */
Mdl.prototype.saveOnClient = function() {
  shr.setItem(config.AUTH_STORAGE_KEY, this.id); // set again
};

/**
 * Remove a session from a server and a local storage
 */
Mdl.prototype.logout = function() {
  // from cookie or context
  srv.w2011(function(errDel) {
    // if sid is wrong - skip this error
    lgr.error(errDel);
    // no callbask: if err - expired sessions will be removed automatically from db
    shr.removeItem(config.AUTH_STORAGE_KEY);

    window.location.reload();
  });
};

/**
 * Html markup for auth-yes block (auth-profile)
 * @returns {String}
 */
Mdl.prototype.buildHtmlAuthYes = function() {
  return this.markupAuthYes(this);
};

/** 
 * Show profile info and logout button
 */
Mdl.prototype.showAuth = function(next) {
  dhr.hideElems('.' + this.root.cls.notif);
  var htmlAuthYes = this.buildHtmlAuthYes();
  dhr.html('.' + this.root.cls.authYesWrap, htmlAuthYes);
  next();
};

/**
 * Create an instance
 */
exports.init = function() {
  var obj = Object.create(Mdl.prototype);
  Mdl.apply(obj, arguments);
  return obj;
};

module.exports = exports;
