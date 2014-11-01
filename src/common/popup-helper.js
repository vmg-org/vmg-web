/** @module */
var dhr = require('../vmg-helpers/dom');

exports.turnPopup = function(popupName) {
  var targetElems = dhr.getElems('.' + popupName);
  if (dhr.isElems(targetElems, ':visible')) {
    dhr.hideElems(targetElems, 'fast');
  } else {
    dhr.showElems(targetElems, 'fast');
  }
};

exports.hidePopupByEscape = function(popupName, e) {
  if (e.keyCode === 27) {
    dhr.hideElems('.' + popupName, 'fast');
  }
};

exports.hidePopupIfOut = function(popupName, e) {
  if (e.currentTarget === e.target.parentElement) {
    dhr.hideElems('.' + popupName, 'fast');
  }
};

module.exports = exports;
