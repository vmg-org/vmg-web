/** @module */
'use strict';

var mapKeys = function(data, prop) {
  this[prop] = data[prop];
};

var Mdl = function(data) {
  Object.keys(data).forEach(mapKeys.bind(this, data));
  this.style = 'color: ' + this.color;
};

exports.init = function(data) {
  return new Mdl(data);
};

module.exports = exports;
