/** @module */
'use strict';
var shr = require('../vmg-helpers/shr');
var config = require('../config');

var mapKeys = function(data, prop) {
  this[prop] = data[prop];
};

var Mdl = function(data) {
  Object.keys(data).forEach(mapKeys.bind(this, data));
};

Mdl.prototype.saveOnClient = function() {
  shr.setItem(config.AUTH_STORAGE_KEY, this.id); // set again
};

exports.init = function(data) {
  return new Mdl(data);
};

module.exports = exports;
