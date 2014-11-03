/**
 * Model builder
 * @module
 */
'use strict';
//var ahr = require('../vmg-helpers/app');

var Mdl = function(data, movieTemplate, zpath) {
  this.movieTemplate = movieTemplate;
  this.zpath = zpath;

  Object.keys(data).forEach(this.mapKeys.bind(this, data));
};

Mdl.prototype.mapKeys = function(data, prop) {
  this[prop] = data[prop];
};

exports.init = function() {
  var obj = Object.create(Mdl.prototype);
  Mdl.apply(obj, arguments);
  return obj;
};

module.exports = exports;
