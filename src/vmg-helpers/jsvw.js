/** @module */

var dhr = require('../vmg-helpers/dom');

exports.hideMenuPopup = function() {
  dhr.hideElems('.menu-popup');
};

exports.showMenuPopup = function() {
  dhr.showElems('.menu-popup');
};

module.exports = exports;
