/** @module */
'use strict';
var shr = require('../vmg-helpers/shr');
var config = require('../config');
var dhr = require('../vmg-helpers/dom');
var srv = require('../vmg-services/srv');
var lgr = require('../vmg-helpers/lgr');

var mapKeys = function(data, prop) {
  this[prop] = data[prop];
};

var Mdl = function(data, root) {
  this.root = root;
  Object.keys(data).forEach(mapKeys.bind(this, data));
};

Mdl.prototype.saveOnClient = function() {
  shr.setItem(config.AUTH_STORAGE_KEY, this.id); // set again
};

var handleLogout = function() {
  // from cookie or context
  srv.d4000(function(errDel) {
    // if sid is wrong - skip this error
    lgr.error(errDel);
    // no callbask: if err - expired sessions will be removed automatically from db
    shr.removeItem(config.AUTH_STORAGE_KEY);
    window.location.reload();
  });
};

Mdl.prototype.showAuth = function(next) {
  dhr.hideElems('.' + this.root.cls.authNo);
  dhr.hideElems('.' + this.root.cls.notif);
  // hide auth no block // if visible
  // if r with error (sid not found) set visible block
  // apply display_name to the block
  //  console.log('asdfads', authNoBlockName, authProfileBlockName, err, r);
  dhr.impl(this.root.bem, this.root.cls.authProfile, 'social_profile', [{
    display_name: this.social_profile_item.display_name
  }]);

  var btnLogout = dhr.getElem('.' + this.root.cls.fncLogout);
  dhr.off(btnLogout, 'click');
  dhr.on(btnLogout, 'click', handleLogout);

  dhr.showElems('.' + this.root.cls.authProfile);
  next();
};

exports.init = function(data, root) {
  return new Mdl(data, root);
};

module.exports = exports;
