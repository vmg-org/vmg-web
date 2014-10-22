/** @module viewjs-helper */

var dhr = require('../vmg-helpers/dom');

exports.run = function(app) {
  app.hideElems = function(elem, e, targetName) {
    dhr.hideElems('.' + targetName);
  };

  app.turnPopup = function(elem, e, popupName) {
    var targetElems = dhr.getElems('.' + popupName);
    if (dhr.isElems(targetElems, ':visible')) {
      dhr.hideElems(targetElems, 'fast');
    } else {
      dhr.showElems(targetElems, 'fast');
    }
  };

  app.hidePopupByEscape = function(elem, e, popupName) {
    if (e.keyCode === 27) {
      dhr.hideElems('.' + popupName, 'fast');
    }
  };

  app.hidePopupIfOut = function(elem, e, popupName) {
    if (e.currentTarget === e.target.parentElement) {
      dhr.hideElems('.' + popupName, 'fast');
    }
  };
};

module.exports = exports;
