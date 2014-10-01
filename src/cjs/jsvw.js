/** @module */

var dhr = require('./dom-helper');

exports.hideMenuPopup = function() {
  dhr.addClass('menu-popup', 'hidden');
};

exports.showMenuPopup = function() {
  dhr.removeClass('menu-popup', 'hidden');
};

module.exports = exports;
