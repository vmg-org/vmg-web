/** @module */
var dhr = require('../vmg-helpers/dom');

exports.turnPopup = function(popupName) {
  var targetElems = dhr.getElems('.' + popupName);
  if (dhr.isElems(targetElems, ':visible')) {
    dhr.hideElems(targetElems);
  } else {
    dhr.showElems(targetElems);
  }
};

module.exports = exports;
