/**
 * Storage helper
 * @module vmg-helpers/shr
 */

'use strict';

/**
 * Get an item from a storage
 * @param {String} name - Name of an item
 */
exports.getItem = function(name) {
  return window.sessionStorage.getItem(name);
};

/**
 * Add an item to a storage
 * @param {String} name - Name of an item
 * @param {String} value - Value of an item, only string
 */
exports.setItem = function(name, value) {
  window.sessionStorage.setItem(name, value);
};

/**
 * Remove an item
 * @param {String} name - Name
 */
exports.removeItem = function(name) {
  window.sessionStorage.removeItem(name);
};

module.exports = exports;
